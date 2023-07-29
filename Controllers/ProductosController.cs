using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PDVreact.DTOs;
using PDVreact.Models;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace PDVreact.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductosController : ControllerBase
    {
        private readonly WebApiContext _context;

        public ProductosController(WebApiContext context)
        {
            _context = context;
        }

        // GET: api/Productos
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<ProductoDTO>>> GetProductos()
        {
            return await _context.Productos
                .Select(p => new ProductoDTO { Id = p.Id, Codigo = p.Codigo, Nombre = p.Nombre, Precio = p.Precio, CategoriaId = p.CategoriaId })
                .ToListAsync();
        }

        // GET: api/Productos/5
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductoDTO>> GetProducto(int id)
        {
            var producto = await _context.Productos.FindAsync(id);

            if (producto == null)
            {
                return NotFound();
            }

            var productoDTO = new ProductoDTO { Id = producto.Id, Codigo = producto.Codigo, Nombre = producto.Nombre, Precio = producto.Precio, CategoriaId = producto.CategoriaId };
            return productoDTO;
        }

        // PUT: api/Productos/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> PutProducto(int id, ProductoDTO productoDTO)
        {
            if (id != productoDTO.Id)
            {
                return BadRequest($"Id mismatch: URL id is {id}, but body id is {productoDTO.Id}");
            }


            if (string.IsNullOrWhiteSpace(productoDTO.Codigo) ||
                string.IsNullOrWhiteSpace(productoDTO.Nombre) ||
                productoDTO.Precio <= 0 ||
                productoDTO.CategoriaId <= 0)
            {
                return BadRequest("Los campos Codigo, Nombre, Precio y CategoriaId son obligatorios y deben ser válidos.");
            }

            var producto = await _context.Productos.FindAsync(id);
            if (producto == null)
            {
                return NotFound();
            }

            producto.Codigo = productoDTO.Codigo;
            producto.Nombre = productoDTO.Nombre;
            producto.Precio = productoDTO.Precio;
            producto.CategoriaId = productoDTO.CategoriaId;

            _context.Entry(producto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Productos
        [HttpPost]
        [Authorize(Roles = "Administrador")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ProductoDTO>> PostProducto(ProductoDTO productoDTO)
        {
            if (string.IsNullOrWhiteSpace(productoDTO.Codigo) ||
                string.IsNullOrWhiteSpace(productoDTO.Nombre) ||
                productoDTO.Precio <= 0 ||
                productoDTO.CategoriaId <= 0)
            {
                return BadRequest("Los campos Codigo, Nombre, Precio y CategoriaId son obligatorios y deben ser válidos.");
            }

            var producto = new Producto { Codigo = productoDTO.Codigo, Nombre = productoDTO.Nombre, Precio = productoDTO.Precio, CategoriaId = productoDTO.CategoriaId };

            _context.Productos.Add(producto);
            await _context.SaveChangesAsync();

            productoDTO.Id = producto.Id;
            return CreatedAtAction("GetProducto", new { id = producto.Id }, productoDTO);
        }

        // DELETE: api/Productos/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteProducto(int id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null)
            {
                return NotFound();
            }

            _context.Productos.Remove(producto);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Productos/ByCategoria/5
        [HttpGet("ByCategoria/{categoriaId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<ProductoDTO>>> GetProductosByCategoria(int categoriaId)
        {
            return await _context.Productos
                .Where(p => p.CategoriaId == categoriaId)
                .Select(p => new ProductoDTO { Id = p.Id, Codigo = p.Codigo, Nombre = p.Nombre, Precio = p.Precio, CategoriaId = p.CategoriaId })
                .ToListAsync();
        }


        private bool ProductoExists(int id)
        {
            return _context.Productos.Any(e => e.Id == id);
        }
    }
}
