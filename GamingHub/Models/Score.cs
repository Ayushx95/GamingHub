namespace GamingHub.Models
{
    public class Score
    {
        public int Id { get; set; }
        public string Playername { get; set; }
        public string GameName { get; set; }
        public int Points { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
