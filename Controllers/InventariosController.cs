using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PDVreact.Models;
using System.Data;

[ApiController]
[Route("[controller]")]
public class InventariosController : ControllerBase
{
    private readonly WebApiContext _context;

    public InventariosController(WebApiContext context)
    {
        _context = context;
    }

    // GET: api/Inventarios
    [HttpGet]
    public async Task<ActionResult<IEnumerable<InventarioDTO>>> GetInventarios()
    {
        return await _context.Inventarios
            .Include(i => i.Producto)
            .Select(i => new InventarioDTO
            {
                Id = i.Id,
                ProductoId = i.ProductoId,
                Cantidad = i.Cantidad
            })
            .ToListAsync();
    }

    // GET: api/Inventarios/5
    [HttpGet("{id}")]
    public async Task<ActionResult<InventarioDTO>> GetInventario(int id)
    {
        var inventario = await _context.Inventarios.Include(i => i.Producto).FirstOrDefaultAsync(i => i.Id == id);

        if (inventario == null)
        {
            return NotFound();
        }

        var inventarioDTO = new InventarioDTO
        {
            Id = inventario.Id,
            ProductoId = inventario.ProductoId,
            Cantidad = inventario.Cantidad
        };

        return inventarioDTO;
    }

    // PUT: api/Inventarios/5
    [HttpPut("{id}")]
    [Authorize(Roles = "Administrador")]
    public async Task<IActionResult> PutInventario(int id, InventarioDTO inventarioDTO)
    {
        if (id != inventarioDTO.Id)
        {
            return BadRequest();
        }

        var inventario = await _context.Inventarios.FindAsync(id);
        if (inventario == null)
        {
            return NotFound();
        }

        // Get the associated product.
        var producto = await _context.Productos.FindAsync(inventarioDTO.ProductoId);
        if (producto == null)
        {
            return NotFound();
        }

        inventario.ProductoId = inventarioDTO.ProductoId;
        inventario.Cantidad = inventarioDTO.Cantidad;


        _context.Entry(inventario).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!InventarioExists(id))
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


    // POST: api/Inventarios
    [HttpPost]
    [Authorize(Roles = "Administrador")]
    public async Task<ActionResult<InventarioDTO>> PostInventario(InventarioDTO inventarioDTO)
    {
        var inventario = new Inventario
        {
            ProductoId = inventarioDTO.ProductoId,
            Cantidad = inventarioDTO.Cantidad
        };

        _context.Inventarios.Add(inventario);
        await _context.SaveChangesAsync();

        inventarioDTO.Id = inventario.Id;
        return CreatedAtAction("GetInventario", new { id = inventario.Id }, inventarioDTO);
    }

    // DELETE: api/Inventarios/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Administrador")]
    public async Task<IActionResult> DeleteInventario(int id)
    {
        var inventario = await _context.Inventarios.FindAsync(id);
        if (inventario == null)
        {
            return NotFound();
        }

        _context.Inventarios.Remove(inventario);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool InventarioExists(int id)
    {
        return _context.Inventarios.Any(e => e.Id == id);
    }
}
