import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Snake from "./games/Snake";

function Home() {
  const [games, setGames] = useState([]);
  const [scores, setScores] = useState([]);

  useEffect(() => {
    axios
      .get("https://gaminghub-n9w6.onrender.com/api/Games")
      .then((response) => {
        setGames(response.data);
      })
      .catch((error) => {
        console.error("Error loading games:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://gaminghub-n9w6.onrender.com/Score")
      .then((response) => {
        setScores(response.data);
      })
      .catch((error) => {
        console.error("Error loading scores:", error);
      });
  }, []);

  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="logo">
          🎮 Game<span>Hub</span>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <a href="#games">Games</a>
          <a href="#leaderboard">Leaderboard</a>
        </div>

        <button className="login-btn">
          Login
        </button>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            🎮 WELCOME TO THE ARENA
          </div>

          <h1>
            PLAY.
            <br />
            <span>COMPETE.</span>
            <br />
            LEVEL UP.
          </h1>

          <p className="hero-description">
            Challenge yourself, beat high scores,
            discover new games, and become the
            ultimate Gaming Hub champion.
          </p>

          <div className="hero-buttons">
            <a href="#games" className="play-btn">
              🎮 Explore Games
            </a>

            <a href="#leaderboard" className="secondary-btn">
              🏆 Leaderboard
            </a>
          </div>

          <div className="hero-stats">
            <div>
              <strong>{games.length}+</strong>
              <span>Games</span>
            </div>

            <div>
              <strong>{scores.length}+</strong>
              <span>Players</span>
            </div>

            <div>
              <strong>∞</strong>
              <span>Fun</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="glow-circle"></div>

          <div className="controller">
            🎮
          </div>

          <div className="floating-card card-one">
            🏆

            <div>
              <strong>Top Score</strong>

              <span>
                {scores.length > 0
                  ? `${Math.max(
                      ...scores.map((s) => s.points)
                    )} Points`
                  : "Be the first"}
              </span>
            </div>
          </div>

          <div className="floating-card card-two">
            ⚡

            <div>
              <strong>Play</strong>
              <span>Compete & Win</span>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <span>SCROLL TO EXPLORE</span>
          <div>↓</div>
        </div>
      </section>

      <section className="games-section" id="games">
        <div className="section-heading">
          <div>
            <p>EXPLORE THE ARCADE</p>
            <h2>Featured Games</h2>
          </div>

          <span className="section-count">
            {games.length} Games
          </span>
        </div>

        <div className="games-grid">
          {games.map((game) => (
            <div className="game-card" key={game.id}>
              <div className="game-image">
                <span>🎮</span>
              </div>

              <div className="game-info">
                <span className="category">
                  {game.category}
                </span>

                <h3>{game.name}</h3>

                <p>{game.description}</p>

                {game.name.toLowerCase() === "snake" ? (
                  <Link
                    to="/games/snake"
                    className="play-game-btn"
                  >
                    Play Game <span>→</span>
                  </Link>
                ) : (
                  <button className="play-game-btn">
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="features-section">
        <div className="feature">
          <div className="feature-icon">
            🎮
          </div>

          <h3>Play</h3>

          <p>
            Discover arcade games and challenge
            yourself with every round.
          </p>
        </div>

        <div className="feature">
          <div className="feature-icon">
            🏆
          </div>

          <h3>Compete</h3>

          <p>
            Put your skills to the test and climb
            the global leaderboard.
          </p>
        </div>

        <div className="feature">
          <div className="feature-icon">
            ⚡
          </div>

          <h3>Level Up</h3>

          <p>
            Keep playing, improve your scores,
            and become a gaming champion.
          </p>
        </div>
      </section>

      <section
        className="leaderboard"
        id="leaderboard"
      >
        <div className="leaderboard-heading">
          <div>
            <p>COMPETE WITH PLAYERS</p>

            <h2>
              🏆 Global Leaderboard
            </h2>
          </div>

          <span>
            TOP SCORES
          </span>
        </div>

        <div className="leaderboard-box">
          {scores.length === 0 ? (
            <div className="empty-leaderboard">
              <span>🏆</span>

              <h3>
                No scores yet
              </h3>

              <p>
                Be the first player to claim
                the top spot.
              </p>

              <Link
                to="/games/snake"
                className="play-game-btn"
              >
                Play Snake →
              </Link>
            </div>
          ) : (
            scores
              .slice()
              .sort(
                (a, b) =>
                  b.points - a.points
              )
              .map((score, index) => (
                <div
                  className={`player ${
                    index === 0
                      ? "first-place"
                      : ""
                  }`}
                  key={score.id}
                >
                  <div className="player-rank">
                    {index === 0
                      ? "🥇"
                      : index === 1
                        ? "🥈"
                        : index === 2
                          ? "🥉"
                          : `#${index + 1}`}
                  </div>

                  <div className="player-info">
                    <strong>
                      {score.playername}
                    </strong>

                    <span>
                      {score.gamename}
                    </span>
                  </div>

                  <div className="player-score">
                    {score.points}

                    <small>
                      {" "}
                      PTS
                    </small>
                  </div>
                </div>
              ))
          )}
        </div>
      </section>

      <section className="cta-section">
        <div>
          <p>READY TO PLAY?</p>

          <h2>
            Your next high score
            <br />
            starts here.
          </h2>

          <p className="cta-description">
            Pick a game, challenge yourself,
            and make your way to the top.
          </p>

          <Link
            to="/games/snake"
            className="play-btn"
          >
            🎮 Play Snake
          </Link>
        </div>

        <div className="cta-controller">
          🎮
        </div>
      </section>

      <footer>
        <div className="footer-main">
          <div>
            <Link
              to="/"
              className="logo"
            >
              🎮 Game<span>Hub</span>
            </Link>

            <p>
              Play games. Beat scores.
              Have fun.
            </p>
          </div>

          <div className="footer-links">
            <a href="#games">
              Games
            </a>

            <a href="#leaderboard">
              Leaderboard
            </a>

            <Link to="/games/snake">
              Snake
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © 2026 Gaming Hub
          </span>

          <span>
            Built with React + ASP.NET Core
          </span>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/games/snake"
          element={<Snake />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;