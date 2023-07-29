using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using PDVreact.DTOs;
using PDVreact.Models;

namespace PDVreact.Controllers
{
    [Route("[controller]")]
    [Authorize(Roles = "Administrador")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly UserManager<Usuario> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;

        public UsuariosController(UserManager<Usuario> userManager, RoleManager<IdentityRole> roleManager, IMapper mapper, IConfiguration config)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _mapper = mapper;
            _config = config;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsuarioDTO>>> GetUsuarios()
        {
            var usuarios = await _userManager.Users.ToListAsync();
            var usuarioDTOs = new List<UsuarioDTO>();

            foreach (var user in usuarios)
            {
                var userDto = _mapper.Map<UsuarioDTO>(user);
                var roles = await _userManager.GetRolesAsync(user);
                userDto.Rol = roles.FirstOrDefault();
                usuarioDTOs.Add(userDto);
            }

            return usuarioDTOs;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UsuarioDTO>> GetUsuario(string id)
        {
            var usuario = await _userManager.FindByIdAsync(id);

            if (usuario == null)
            {
                return NotFound();
            }

            var usuarioDTO = _mapper.Map<UsuarioDTO>(usuario);
            var roles = await _userManager.GetRolesAsync(usuario);
            usuarioDTO.Rol = roles.FirstOrDefault();

            return usuarioDTO;
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsuario(string id, UsuarioDTO usuarioDTO)
        {
            if (id != usuarioDTO.Id)
            {
                return BadRequest();
            }

            var usuario = await _userManager.FindByIdAsync(id);
            if (usuario == null)
            {
                return NotFound();
            }

            _mapper.Map(usuarioDTO, usuario);

            var result = await _userManager.UpdateAsync(usuario);

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
                return BadRequest(ModelState);
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<UsuarioDTO>> PostUsuario(UsuarioCreateDTO usuarioCreateDTO)
        {
            if (await _userManager.Users.AnyAsync(u => u.UserName == usuarioCreateDTO.Nombre))
            {
                ModelState.AddModelError(string.Empty, "Ya existe un usuario con ese nombre");
                return BadRequest(ModelState);
            }

            var usuario = _mapper.Map<Usuario>(usuarioCreateDTO);
            usuario.UserName = usuarioCreateDTO.Nombre;

            var result = await _userManager.CreateAsync(usuario, usuarioCreateDTO.Contraseña);

            if (result.Succeeded)
            {
                if (await _roleManager.RoleExistsAsync(usuarioCreateDTO.Rol))
                {
                    await _userManager.AddToRoleAsync(usuario, usuarioCreateDTO.Rol);

                    // fetch the role after it's been assigned
                    var roles = await _userManager.GetRolesAsync(usuario);
                    var usuarioDTO = _mapper.Map<UsuarioDTO>(usuario);
                    usuarioDTO.Rol = roles.FirstOrDefault();

                    return CreatedAtAction("GetUsuario", new { id = usuario.Id }, usuarioDTO);
                }
                else
                {
                    ModelState.AddModelError(string.Empty, $"Role '{usuarioCreateDTO.Rol}' does not exist");
                }
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return BadRequest(ModelState);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(string id)
        {
            var usuario = await _userManager.Users.Include(u => u.Ventas).FirstOrDefaultAsync(u => u.Id == id);
            if (usuario == null)
            {
                return NotFound();
            }

            if (usuario.Ventas.Any())
            {
                ModelState.AddModelError(string.Empty, "No se puede eliminar un usuario que tenga ventas registradas");
                return BadRequest(ModelState);
            }

            var result = await _userManager.DeleteAsync(usuario);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
                return BadRequest(ModelState);
            }

            return NoContent();
        }

    }
}
    
