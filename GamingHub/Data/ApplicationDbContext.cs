using GamingHub.Models;
using Microsoft.EntityFrameworkCore;

namespace GamingHub.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
            
        }
        public DbSet<Game> Games { get; set; }
        public DbSet<Score> Scores { get; set; }
    }
}
