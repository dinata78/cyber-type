import { useEffect, useRef, useState } from "react"
import "./index.css"
import { Letter } from "./Letter";
import { GameInput } from "./GameInput";

function App() {
  const [ gameState, setGameState ] = useState("lobby");
  const [ typed, setTyped ] = useState("");
  const [ timeElapsed, setTimeElapsed ] = useState(0);
  const [ finalWpm, setFinalWpm ] = useState(0);

  const target = "I don't really know yet, so please don't ask me.";
  const targetArray = target.split("");

  const timerId = useRef(null);

  const handleInputChange = (e) => {
    if (gameState === "finished") return;

    const value = e.target.value;

    setTyped(value);

    if (gameState === "idle" && value.length === 1) {
      console.log("First letter typed.");
      setGameState("running");
      console.log("Game state set to 'running'");
    }
  }

  const getTypingSpeed = (typed, timeElapsed) => {
    if (timeElapsed <= 0) return 0;

    const wordsTyped = typed.length / 5;
    const wpm = Math.round((wordsTyped / timeElapsed) * 60 * 100) / 100;

    return wpm;
  }

  const liveWpm = getTypingSpeed(typed, timeElapsed);

  useEffect(() => {
    if (gameState !== "running") return;

    const startTime = Date.now();

    timerId.current = setInterval(() => {
      const timeNow = Date.now();
      const timePassed = timeNow - startTime;
      const timePassedInSeconds = timePassed / 1000;

      setTimeElapsed(timePassedInSeconds);
    }, 128);

    return () => clearInterval(timerId.current);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "finished") return;

    clearInterval(timerId.current);
    console.log("Stopped timer.")
    setFinalWpm(liveWpm);
    console.log("Stored final WPM.");
    setTyped("");
    console.log("Cleared input's value.");
    setTimeElapsed(0);
    console.log("Cleared time elapsed.");
  }, [gameState]);

  useEffect(() => {
    if (typed === target) {
      console.log("Done!")
      setGameState("finished");
      console.log("Game state set to 'finished'")
    }
  }, [typed])

  return (
    <div id="genesis">
      <h1>Welcome to CyberType!</h1>

      {
        gameState === "lobby" ?
          <button onClick={() => {
            setGameState("idle")
            console.log("Game state set to 'idle'")
            }}>
            Start Game
          </button>
        : <>

            <div id="target">
              {
                targetArray.map((letter, index) => {
                  return (
                    <Letter
                      key={index}
                      typed={typed}
                      position={index}
                      letter={letter}
                    />
                  )
                })
              }
            </div>

            <GameInput
              typed={typed}
              onChange={handleInputChange}
              isDisabled={gameState === "finished"}
            />
            
            <div>
              Speed (WPM): {gameState === "finished" ? finalWpm : liveWpm}
            </div>

          </>
      }
    </div>
  )
}

export default App
