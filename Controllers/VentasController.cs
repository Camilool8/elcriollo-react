using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PDVreact.DTOs;
using PDVreact.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PDVreact.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VentasController : ControllerBase
    {
        private readonly WebApiContext _context;
        private readonly IMapper _mapper;
        private readonly UserManager<Usuario> _userManager;

        public VentasController(WebApiContext context, IMapper mapper, UserManager<Usuario> userManager)
        {
            _context = context;
            _mapper = mapper;
            _userManager = userManager;
        }

        // GET: api/Ventas
        [HttpGet]
        public async Task<ActionResult<List<VentaDTO>>> GetAllVentas()
        {
            var ventas = await _context.Ventas
                .Include(v => v.DetalleVentas)
                    .ThenInclude(dv => dv.Producto)
                .Include(v => v.Cliente)
                .Include(v => v.Cuentas)
                .Include(v => v.Usuario)
                .Include(v => v.Mesa)
                .Include(v => v.Cuentas)
                .ToListAsync();

            if (ventas == null || !ventas.Any())
            {
                return NotFound();
            }

            return Ok(_mapper.Map<List<VentaDTO>>(ventas));
        }


        // GET: api/Ventas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<VentaDTO>> GetVenta(int id)
        {
            var venta = await _context.Ventas.FindAsync(id);
            if (venta == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<VentaDTO>(venta));
        }
        // POST: api/Ventas
        [HttpPost]
        public async Task<ActionResult<VentaDTO>> CreateVenta(VentaCreateDTO ventaCreateDto)
        {
            var usuario = await _userManager.FindByIdAsync(ventaCreateDto.UsuarioId);
            if (usuario == null)
            {
                return NotFound("Usuario no encontrado");
            }

            var cliente = await _context.Clientes.FindAsync(ventaCreateDto.ClienteId);
            if (cliente == null)
            {
                return NotFound("Cliente no encontrado");
            }

            var mesa = await _context.Mesas.FindAsync(ventaCreateDto.MesaId);
            if (mesa == null)
            {
                return NotFound("Mesa no encontrada");
            }

            var venta = new Venta
            {
                Usuario = usuario,
                Cliente = cliente,
                Estado = ventaCreateDto.Estado,
                Mesa = mesa,
                MetodoPago = ventaCreateDto.MetodoPago,
                Fecha = ventaCreateDto.Fecha
            };

            _context.SavingChanges += (sender, args) =>
            {
                var entries = _context.ChangeTracker.Entries<Venta>();
                foreach (var entry in entries)
                {
                    Console.WriteLine($"Entity: {entry.Entity.GetType().Name}, State: {entry.State}");
                }
            };

            _context.Ventas.Add(venta);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVenta", new { id = venta.Id }, _mapper.Map<VentaDTO>(venta));
        }





        // PUT: api/Ventas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVenta(int id, VentaUpdateDTO ventaUpdateDto)
        {
            var venta = await _context.Ventas.FindAsync(id);
            if (venta == null)
            {
                return NotFound();
            }
            _mapper.Map(ventaUpdateDto, venta);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Ventas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVenta(int id)
        {
            var venta = await _context.Ventas.FindAsync(id);
            if (venta == null)
            {
                return NotFound();
            }
            _context.Ventas.Remove(venta);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // POST: api/Ventas/5/Productos
        [HttpPost("{id}/productos")]
        public async Task<ActionResult<DetalleVentaDTO>> AddProducto(int id, DetalleVentaCreateDTO detalleVentaCreateDto)
        {
            var venta = await _context.Ventas.Include(v => v.DetalleVentas).FirstOrDefaultAsync(v => v.Id == id);
            var producto = await _context.Productos.FindAsync(detalleVentaCreateDto.ProductoId);
            if (venta == null || producto == null)
            {
                return NotFound();
            }
            var detalleVenta = new DetalleVenta
            {
                Venta = venta,
                Producto = producto,
                Cantidad = detalleVentaCreateDto.Cantidad
            };
            venta.DetalleVentas.Add(detalleVenta);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetVenta", new { id = venta.Id }, _mapper.Map<VentaDTO>(venta));
        }

        // PUT: api/Ventas/5/Productos/7
        [HttpPut("{id}/productos/{detalleId}")]
        public async Task<ActionResult<DetalleVentaDTO>> UpdateProducto(int id, int detalleId, DetalleVentaCreateDTO detalleVentaUpdateDto)
        {
            var venta = await _context.Ventas.Include(v => v.DetalleVentas).FirstOrDefaultAsync(v => v.Id == id);
            var producto = await _context.Productos.FindAsync(detalleVentaUpdateDto.ProductoId);
            if (venta == null || producto == null)
            {
                return NotFound();
            }

            var detalleVenta = venta.DetalleVentas.FirstOrDefault(dv => dv.Id == detalleId);
            if (detalleVenta == null)
            {
                return NotFound();
            }

            detalleVenta.Producto = producto;
            detalleVenta.Cantidad = detalleVentaUpdateDto.Cantidad;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Ventas/5/Productos/7
        [HttpDelete("{id}/productos/{detalleId}")]
        public async Task<ActionResult<DetalleVentaDTO>> DeleteProducto(int id, int detalleId)
        {
            var venta = await _context.Ventas.Include(v => v.DetalleVentas).FirstOrDefaultAsync(v => v.Id == id);
            if (venta == null)
            {
                return NotFound();
            }

            var detalleVenta = venta.DetalleVentas.FirstOrDefault(dv => dv.Id == detalleId);
            if (detalleVenta == null)
            {
                return NotFound();
            }

            _context.Detalle.Remove(detalleVenta);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        [HttpGet("mesa/{mesaId}/venta")]
        public async Task<ActionResult<VentaDTO>> GetVentaMesa(int mesaId)
        {
            var venta = await _context.Ventas
                .Include(v => v.DetalleVentas)
                    .ThenInclude(dv => dv.Producto)
                .Include(v => v.Cliente)
                .Include(v => v.Cuentas)
                .Include(v => v.Usuario)
                .Include(v => v.Mesa)
                .Include(v => v.Cuentas)
                .FirstOrDefaultAsync(v => v.Mesa.Id == mesaId && v.Estado == "En proceso");

            if (venta == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<VentaDTO>(venta));
        }

        // Nueva ruta para obtener los productos de una venta
        [HttpGet("mesa/{mesaId}")]
        public async Task<ActionResult<IEnumerable<DetalleVentaDTO>>> GetProductosVenta(int mesaId)
        {
            var venta = await _context.Ventas
                .Include(v => v.DetalleVentas)
                    .ThenInclude(dv => dv.Producto)
                .Include(v => v.Cliente)
                .Include(v => v.Cuentas)
                .FirstOrDefaultAsync(v => v.Mesa.Id == mesaId && v.Estado == "En proceso");

            if (venta == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<IEnumerable<DetalleVentaDTO>>(venta.DetalleVentas));
        }

    }
}
