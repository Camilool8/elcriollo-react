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
    public class FacturasController : ControllerBase
    {
        private readonly WebApiContext _context;
        private readonly IMapper _mapper;

        public FacturasController(WebApiContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Facturas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FacturaDTO>>> GetFacturas()
        {
            var facturas = await _context.Facturas.ToListAsync();

            return Ok(_mapper.Map<IEnumerable<FacturaDTO>>(facturas));
        }

        // GET: api/Facturas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FacturaDTO>> GetFactura(int id)
        {
            var factura = await _context.Facturas.FindAsync(id);
            if (factura == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<FacturaDTO>(factura));
        }

        // POST: api/Facturas
        [HttpPost]
        public async Task<ActionResult<FacturaDTO>> PostFactura(FacturaDTO facturaDto)
        {
            var factura = _mapper.Map<Factura>(facturaDto);
            _context.Facturas.Add(factura);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetFactura), new { id = factura.Id }, _mapper.Map<FacturaDTO>(factura));
        }

        // PUT: api/Facturas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFactura(int id, FacturaDTO facturaDto)
        {
            if (id != facturaDto.Id)
            {
                return BadRequest();
            }

            var factura = await _context.Facturas.FindAsync(id);
            if (factura == null)
            {
                return NotFound();
            }

            _mapper.Map(facturaDto, factura);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Facturas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFactura(int id)
        {
            var factura = await _context.Facturas.FindAsync(id);
            if (factura == null)
            {
                return NotFound();
            }
            _context.Facturas.Remove(factura);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET: api/Facturas/Venta/5
        [HttpGet("venta/{ventaId}")]
        public async Task<ActionResult<IEnumerable<FacturaDTO>>> GetFacturasPorVenta(int ventaId)
        {
            var cuentasIds = await _context.Cuentas.Where(c => c.VentaId == ventaId).Select(c => c.Id).ToListAsync();
            var facturas = await _context.Facturas.Where(f => cuentasIds.Contains(f.CuentaId)).ToListAsync();

            if (!facturas.Any())
            {
                return NotFound();
            }
            return Ok(_mapper.Map<IEnumerable<FacturaDTO>>(facturas));
        }

    }
}
