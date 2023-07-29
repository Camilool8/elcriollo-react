namespace PDVreact.Controllers
{
    using global::PDVreact.DTOs;
    using global::PDVreact.Models;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    namespace PDVreact.Controllers
    {
        [ApiController]
        [Route("[controller]")]
        public class CategoriasController : ControllerBase
        {
            private readonly WebApiContext _context;
            private readonly ILogger<CategoriasController> _logger;

            public CategoriasController(WebApiContext context, ILogger<CategoriasController> logger)
            {
                _context = context;
                _logger = logger;
            }

            // GET: api/Categorias
            [HttpGet]
            public async Task<ActionResult<IEnumerable<CategoriaDTO>>> GetCategorias()
            {
                try
                {
                    return await _context.Categorias
                        .Select(c => new CategoriaDTO { Id = c.Id, Nombre = c.Nombre })
                        .ToListAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error al obtener categorías");
                    return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener datos del servidor.");
                }
            }

            // GET: api/Categorias/5
            [HttpGet("{id}")]
            public async Task<ActionResult<CategoriaDTO>> GetCategoria(int id)
            {
                try
                {
                    var categoria = await _context.Categorias.FindAsync(id);

                    if (categoria == null)
                    {
                        return NotFound();
                    }

                    var categoriaDTO = new CategoriaDTO { Id = categoria.Id, Nombre = categoria.Nombre };
                    return categoriaDTO;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error al obtener categoría con id {Id}", id);
                    return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener datos del servidor.");
                }
            }

            // PUT: api/Categorias/5
            [HttpPut("{id}")]
            [Authorize(Roles = "Administrador")]
            public async Task<IActionResult> PutCategoria(int id, CategoriaDTO categoriaDTO)
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (id != categoriaDTO.Id)
                {
                    return BadRequest();
                }

                var categoria = await _context.Categorias.FindAsync(id);
                if (categoria == null)
                {
                    return NotFound();
                }

                categoria.Nombre = categoriaDTO.Nombre;

                _context.Entry(categoria).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException ex)
                {
                    if (!CategoriaExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        _logger.LogError(ex, "Error al actualizar categoría con id {Id}", id);
                        return StatusCode(StatusCodes.Status500InternalServerError, "Error al actualizar datos en el servidor.");
                    }
                }

                return NoContent();
            }

            // POST: api/Categorias
            [HttpPost]
            [Authorize(Roles = "Administrador")]
            public async Task<ActionResult<CategoriaDTO>> PostCategoria(CategoriaDTO categoriaDTO)
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var categoria = new Categoria { Nombre = categoriaDTO.Nombre };

                _context.Categorias.Add(categoria);
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error al crear categoría");
                    return StatusCode(StatusCodes.Status500InternalServerError, "Error al crear datos en el servidor.");
                }

                categoriaDTO.Id = categoria.Id;
                return CreatedAtAction("GetCategoria", new { id = categoria.Id }, categoriaDTO);
            }

            // DELETE: api/Categorias/5
            [HttpDelete("{id}")]
            [Authorize(Roles = "Administrador")]
            public async Task<IActionResult> DeleteCategoria(int id)
            {
                var categoria = await _context.Categorias.FindAsync(id);
                if (categoria == null)
                {
                    return NotFound();
                }

                _context.Categorias.Remove(categoria);
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error al eliminar categoría con id {Id}", id);
                    return StatusCode(StatusCodes.Status500InternalServerError, "Error al eliminar datos del servidor.");
                }

                return NoContent();
            }

            private bool CategoriaExists(int id)
            {
                return _context.Categorias.Any(e => e.Id == id);
            }
        }
    }

}
