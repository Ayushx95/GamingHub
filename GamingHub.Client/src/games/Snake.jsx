import { useEffect, useState } from "react";
import axios from "axios";
import "./Snake.css";

const BOARD_SIZE = 20;

function Snake() {
  const [snake, setSnake] = useState([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);

  const [food, setFood] = useState({ x: 15, y: 10 });
  const [direction, setDirection] = useState("RIGHT");
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  // Player name
  const [playerName, setPlayerName] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);

  // Save score to backend
  const saveScore = async (finalScore) => {
    try {
      console.log("Saving score:", finalScore);

      const response = await axios.post(
        "https://localhost:44355/Score",
        {
          playerName: playerName,
          gameName: "Snake",
          points: finalScore,
        }
      );

      console.log("Score saved successfully!", response.data);
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  // Save score when game is over
  useEffect(() => {
    if (gameOver && nameSubmitted) {
      saveScore(score);
    }
  }, [gameOver]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();

      if (!started || gameOver) {
        return;
      }

      if (key === "arrowup" && direction !== "DOWN") {
        setDirection("UP");
      }

      if (key === "arrowdown" && direction !== "UP") {
        setDirection("DOWN");
      }

      if (key === "arrowleft" && direction !== "RIGHT") {
        setDirection("LEFT");
      }

      if (key === "arrowright" && direction !== "LEFT") {
        setDirection("RIGHT");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [direction, started, gameOver]);

  // Game loop
  useEffect(() => {
    if (!started || gameOver) {
      return;
    }

    const timer = setInterval(() => {
      moveSnake();
    }, 150);

    return () => clearInterval(timer);
  });

  // Move snake
  const moveSnake = () => {
    setSnake((currentSnake) => {
      const head = currentSnake[0];

      const newHead = {
        x:
          direction === "LEFT"
            ? head.x - 1
            : direction === "RIGHT"
              ? head.x + 1
              : head.x,

        y:
          direction === "UP"
            ? head.y - 1
            : direction === "DOWN"
              ? head.y + 1
              : head.y,
      };

      // Wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= BOARD_SIZE ||
        newHead.y < 0 ||
        newHead.y >= BOARD_SIZE
      ) {
        setGameOver(true);
        return currentSnake;
      }

      // Body collision
      const hitBody = currentSnake.some(
        (part) =>
          part.x === newHead.x &&
          part.y === newHead.y
      );

      if (hitBody) {
        setGameOver(true);
        return currentSnake;
      }

      const newSnake = [newHead, ...currentSnake];

      // Food collision
      if (
        newHead.x === food.x &&
        newHead.y === food.y
      ) {
        setScore((currentScore) => currentScore + 10);

        setFood({
          x: Math.floor(Math.random() * BOARD_SIZE),
          y: Math.floor(Math.random() * BOARD_SIZE),
        });

        return newSnake;
      }

      // Remove tail
      newSnake.pop();

      return newSnake;
    });
  };

  // Start game
  const startGame = () => {
    if (playerName.trim() === "") {
      return;
    }

    setNameSubmitted(true);
    setStarted(true);
  };

  // Restart game
  const restartGame = () => {
    setSnake([
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ]);

    setFood({ x: 15, y: 10 });
    setDirection("RIGHT");
    setScore(0);
    setGameOver(false);
    setStarted(true);
  };

  // Name screen
  if (!nameSubmitted) {
    return (
      <div className="snake-page">

        <div className="name-screen">

          <p className="game-label">
            ARCADE
          </p>

          <h1>🐍 Snake</h1>

          <p>
            Enter your player name to start
          </p>

          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) =>
              setPlayerName(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                startGame();
              }
            }}
          />

          <button onClick={startGame}>
            Start Game
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="snake-page">

      {/* HEADER */}
      <div className="snake-header">

        <div>
          <p className="game-label">
            PLAYER: {playerName}
          </p>

          <h1>🐍 Snake</h1>
        </div>

        <div className="score">
          <span>Score</span>
          <strong>{score}</strong>
        </div>

      </div>

      {/* GAME BOARD */}
      <div className="snake-board">

        {Array.from({
          length: BOARD_SIZE * BOARD_SIZE,
        }).map((_, index) => {

          const x = index % BOARD_SIZE;
          const y = Math.floor(index / BOARD_SIZE);

          const isSnake = snake.some(
            (part) =>
              part.x === x &&
              part.y === y
          );

          const isHead =
            snake[0]?.x === x &&
            snake[0]?.y === y;

          const isFood =
            food.x === x &&
            food.y === y;

          return (
            <div
              key={index}
              className={`
                cell
                ${isSnake ? "snake-cell" : ""}
                ${isHead ? "snake-head" : ""}
                ${isFood ? "food-cell" : ""}
              `}
            >
              {isFood && "🍎"}
            </div>
          );
        })}

        {/* GAME OVER */}
        {gameOver && (
          <div className="game-message">

            <h2>
              Game Over
            </h2>

            <p>
              {playerName}'s score: {score}
            </p>

            <p>
              Saving score...
            </p>

            <button onClick={restartGame}>
              Play Again
            </button>

          </div>
        )}

      </div>

      {/* CONTROLS */}
      <div className="controls">

        <p>
          Use ↑ ↓ ← → to move
        </p>

      </div>

    </div>
  );
}

export default Snake;