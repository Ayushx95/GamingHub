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

  const [playerName, setPlayerName] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);

  const [touchStart, setTouchStart] = useState(null);

  const saveScore = async (finalScore) => {
    try {
      console.log("Saving score:", finalScore);

      const response = await axios.post(
        "https://gaminghub-n9w6.onrender.com/Score",
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

  useEffect(() => {
    if (gameOver && nameSubmitted) {
      saveScore(score);
    }
  }, [gameOver]);

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

  const handleTouchStart = (event) => {
    if (!started || gameOver) {
      return;
    }

    const touch = event.touches[0];

    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
    });
  };

  const handleTouchEnd = (event) => {
    if (!started || gameOver || !touchStart) {
      return;
    }

    const touch = event.changedTouches[0];

    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;

    if (Math.abs(deltaX) < 30 && Math.abs(deltaY) < 30) {
      setTouchStart(null);
      return;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0 && direction !== "LEFT") {
        setDirection("RIGHT");
      } else if (deltaX < 0 && direction !== "RIGHT") {
        setDirection("LEFT");
      }
    } else {
      if (deltaY > 0 && direction !== "UP") {
        setDirection("DOWN");
      } else if (deltaY < 0 && direction !== "DOWN") {
        setDirection("UP");
      }
    }

    setTouchStart(null);
  };

  useEffect(() => {
    if (!started || gameOver) {
      return;
    }

    const timer = setInterval(() => {
      moveSnake();
    }, 150);

    return () => clearInterval(timer);
  });

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

      if (
        newHead.x < 0 ||
        newHead.x >= BOARD_SIZE ||
        newHead.y < 0 ||
        newHead.y >= BOARD_SIZE
      ) {
        setGameOver(true);
        return currentSnake;
      }

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

      newSnake.pop();

      return newSnake;
    });
  };

  const startGame = () => {
    if (playerName.trim() === "") {
      return;
    }

    setNameSubmitted(true);
    setStarted(true);
  };

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

      <div
        className="snake-board"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
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

      <div className="controls">
        <p>
          💻 Laptop: Use ↑ ↓ ← →
        </p>

        <p>
          📱 Phone: Swipe on the board
        </p>
      </div>
    </div>
  );
}

export default Snake;