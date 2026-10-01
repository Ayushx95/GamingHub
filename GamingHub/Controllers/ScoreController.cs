using GamingHub.Data;
using GamingHub.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace GamingHub.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ScoreController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ScoreController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> GetScores()
        {
            var scores = await _context.Scores
            .OrderByDescending(s => s.Points)
            .Take(3)
            .ToListAsync();
            return Ok(scores);
        }
        [HttpPost]
        public async Task<IActionResult> AddScore(Score score)
        {
            score.CreatedAt = DateTime.UtcNow;
            _context.Scores.Add(score);

            await _context.SaveChangesAsync();

            return Ok(score);
        }

    }
}
