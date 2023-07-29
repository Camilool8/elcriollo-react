using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PDVreact.DTOs;
using PDVreact.Models;

[Route("[controller]")]
[ApiController]
public class MesasController : ControllerBase
{
    private readonly WebApiContext _context;
    private readonly IMapper _mapper;

    public MesasController(WebApiContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    // GET: /Mesas
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MesaDTO>>> GetMesas()
    {
        var mesas = await _context.Mesas.ToListAsync();
        return _mapper.Map<List<MesaDTO>>(mesas);
    }

    // GET: /Mesas/5
    [HttpGet("{id}")]
    public async Task<ActionResult<MesaDTO>> GetMesa(int id)
    {
        var mesa = await _context.Mesas.FindAsync(id);

        if (mesa == null)
        {
            return NotFound();
        }

        return _mapper.Map<MesaDTO>(mesa);
    }

    // PUT: /Mesas/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutMesa(int id, MesaDTO mesaDTO)
    {
        if (id != mesaDTO.Id)
        {
            return BadRequest();
        }

        var mesa = _mapper.Map<Mesa>(mesaDTO);

        _context.Entry(mesa).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!MesaExists(id))
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

    // POST: /Mesas
    [HttpPost]
    public async Task<ActionResult<MesaDTO>> PostMesa(MesaDTO mesaDTO)
    {
        var mesa = _mapper.Map<Mesa>(mesaDTO);
        _context.Mesas.Add(mesa);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetMesa", new { id = mesa.Id }, _mapper.Map<MesaDTO>(mesa));
    }

    // DELETE: /Mesas/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMesa(int id)
    {
        var mesa = await _context.Mesas.FindAsync(id);
        if (mesa == null)
        {
            return NotFound();
        }

        _context.Mesas.Remove(mesa);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool MesaExists(int id)
    {
        return _context.Mesas.Any(e => e.Id == id);
    }
}
