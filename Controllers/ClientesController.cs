using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PDVreact.DTOs;
using PDVreact.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PDVreact.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ClientesController : ControllerBase
    {
        private readonly WebApiContext _context;

        public ClientesController(WebApiContext context)
        {
            _context = context;
        }

        // GET: api/Clientes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClienteDTO>>> GetClientes()
        {
            return await _context.Clientes
                .Select(c => new ClienteDTO
                {
                    Id = c.Id,
                    Nombre = c.Nombre,
                    Direccion = c.Direccion,
                    Telefono = c.Telefono
                })
                .ToListAsync();
        }

        // GET: api/Clientes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ClienteDTO>> GetCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);

            if (cliente == null)
            {
                return NotFound();
            }

            var clienteDTO = new ClienteDTO
            {
                Id = cliente.Id,
                Nombre = cliente.Nombre,
                Direccion = cliente.Direccion,
                Telefono = cliente.Telefono
            };

            return clienteDTO;
        }

        // PUT: api/Clientes/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Recepcion,Administrador")]
        public async Task<IActionResult> PutCliente(int id, ClienteDTO clienteDTO)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
            {
                return NotFound();
            }

            cliente.Nombre = clienteDTO.Nombre;
            cliente.Direccion = clienteDTO.Direccion;
            cliente.Telefono = clienteDTO.Telefono;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClienteExists(id))
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


        // POST: api/Clientes
        [HttpPost]
        [Authorize(Roles = "Recepcion,Administrador")]
        public async Task<ActionResult<ClienteDTO>> PostCliente(ClienteDTO clienteDTO)
        {
            var cliente = new Cliente { Nombre = clienteDTO.Nombre, Direccion = clienteDTO.Direccion, Telefono = clienteDTO.Telefono };

            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();

            clienteDTO.Id = cliente.Id;
            return CreatedAtAction("GetCliente", new { id = cliente.Id }, clienteDTO);
        }

        // DELETE: api/Clientes/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> DeleteCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
            {
                return NotFound();
            }

            _context.Clientes.Remove(cliente);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ClienteExists(int id)
        {
            return _context.Clientes.Any(e => e.Id == id);
        }
    }
}
