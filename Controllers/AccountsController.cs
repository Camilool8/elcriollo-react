using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using PDVreact.DTOs;
using PDVreact.Models;

namespace PDVreact.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly UserManager<Usuario> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;

        public AccountsController(UserManager<Usuario> userManager, RoleManager<IdentityRole> roleManager, IMapper mapper, IConfiguration config)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _mapper = mapper;
            _config = config;
        }

        // Registration route
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult> Register(UsuarioDTO usuarioDto)
        {
            // Check if the provided role exists
            var roleExists = await _roleManager.RoleExistsAsync(usuarioDto.Rol);
            if (!roleExists)
            {
                return BadRequest(new { message = "El rol ingresado no existe, solo se aceptan: Administrador, Mesero, Cajero y Recepcion" });
            }

            var user = _mapper.Map<Usuario>(usuarioDto);
            user.UserName = usuarioDto.Email;

            var result = await _userManager.CreateAsync(user, usuarioDto.Contraseña);

            if (!result.Succeeded) return BadRequest(result.Errors);

            var roleResult = await _userManager.AddToRoleAsync(user, usuarioDto.Rol);

            if (!roleResult.Succeeded) return BadRequest(result.Errors);

            return Ok();
        }

        // Login route
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<string>> Login(LoginDTO loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user != null && await _userManager.CheckPasswordAsync(user, loginDto.Contraseña))
            {
                var roles = await _userManager.GetRolesAsync(user);

                var claims = new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.Role, roles.First())
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Expires = DateTime.Now.AddDays(1),
                    SigningCredentials = creds,
                    Issuer = _config["Jwt:Issuer"]
                };

                var tokenHandler = new JwtSecurityTokenHandler();
                var token = tokenHandler.CreateToken(tokenDescriptor);

                return Ok(tokenHandler.WriteToken(token));
            }

            return Unauthorized();
        }

        // Ruta para validar el token
        [HttpGet("validate-token")]
        [Authorize]
        public async Task<ActionResult<UsuarioDTO>> ValidateToken()
        {
            var claimsIdentity = this.User.Identity as ClaimsIdentity;
            var userIdClaim = claimsIdentity.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier);

            if (userIdClaim is null)
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByIdAsync(userIdClaim.Value);

            if (user is null)
            {
                return NotFound();
            }

            var roles = await _userManager.GetRolesAsync(user);
            var userDto = _mapper.Map<UsuarioDTO>(user);
            userDto.Rol = roles.First();

            return Ok(userDto);
        }

    }
}
