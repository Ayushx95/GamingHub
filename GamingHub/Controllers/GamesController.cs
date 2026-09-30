using GamingHub.Data;
using GamingHub.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GamingHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GamesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public GamesController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> GetGames()
        {
            var games = await _context.Games.ToListAsync();
            return Ok(games);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGame(int id)
        {
            var game = await _context.Games.FindAsync(id);
            if (game == null)
            {
                return NotFound();
            }
            return Ok(game);
        }
        [HttpPost]
        public async Task<IActionResult> CreateGame(Game game)
        {
            _context.Games.Add(game);
            await _context.SaveChangesAsync();
            return CreatedAtAction(
                nameof(GetGame),
                new { id = game.Id }, game);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGame(int id, Game game)
        {
            if (id!= game.Id)
            {
                return BadRequest();
            }
            _context.Entry(game).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGame(int id)
        {
            var game = await _context.Games.FindAsync(id);
            if (game == null)
            {
                return NotFound();
            }
            _context.Games.Remove(game);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

}

