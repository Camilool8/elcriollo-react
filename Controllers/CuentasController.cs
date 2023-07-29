using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PDVreact.DTOs;
using PDVreact.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PDVreact.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CuentasController : ControllerBase
    {
        private readonly WebApiContext _context;
        private readonly IMapper _mapper;

        public CuentasController(WebApiContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Cuentas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CuentaDTO>>> GetCuentas()
        {
            var cuentas = await _context.Cuentas.ToListAsync();

            return Ok(_mapper.Map<IEnumerable<CuentaDTO>>(cuentas));
        }

        // GET: api/Cuentas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CuentaDTO>> GetCuenta(int id)
        {
            var cuenta = await _context.Cuentas.FindAsync(id);
            if (cuenta == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<CuentaDTO>(cuenta));
        }

        // POST: api/Cuentas
        [HttpPost]
        public async Task<ActionResult<CuentaDTO>> PostCuenta(CuentaDTO cuentaDTO)
        {
            var cuenta = _mapper.Map<Cuenta>(cuentaDTO);
            _context.Cuentas.Add(cuenta);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetCuenta", new { id = cuenta.Id }, _mapper.Map<CuentaDTO>(cuenta));
        }

        // PUT: api/Cuentas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCuenta(int id, CuentaUpdateDTO cuentaUpdateDTO)
        {
            var cuenta = await _context.Cuentas.FindAsync(id);
            if (cuenta == null)
            {
                return NotFound();
            }
            cuenta.Total = cuentaUpdateDTO.Total;
            _context.Entry(cuenta).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Cuentas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCuenta(int id)
        {
            var cuenta = await _context.Cuentas.FindAsync(id);
            if (cuenta == null)
            {
                return NotFound();
            }
            _context.Cuentas.Remove(cuenta);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET: api/Cuentas/Venta/5
        [HttpGet("venta/{ventaId}")]
        public async Task<ActionResult<IEnumerable<CuentaDTO>>> GetCuentasPorVenta(int ventaId)
        {
            var cuentas = await _context.Cuentas.Where(c => c.Venta.Id == ventaId).ToListAsync();
            if (cuentas == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<IEnumerable<CuentaDTO>>(cuentas));
        }

    }
}
