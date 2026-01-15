import { useEffect, useRef, useState } from "react"
import "./index.css"
import { GameInput } from "./GameInput";
import { Word } from "./Word";

function App() {
  const [ gameState, setGameState ] = useState("lobby");
  const [ committedWords, setCommittedWords ] = useState([]);
  const [ typedWord, setTypedWord ] = useState("");
  const [ timeElapsed, setTimeElapsed ] = useState(0);
  const [ finalWpm, setFinalWpm ] = useState(0);

  const target = "I don't really know yet, so please don't ask me.";
  const targetWords = target.split(" "); 

  const timerId = useRef(null);

  const currentWordIndex = committedWords.length;
  const currentLetterIndex = typedWord.length;

  const handleInputChange = (e) => {
    const value = e.target.value;
    const word = value.trim();

    if (
      gameState === "finished" ||
      word.length > targetWords[currentWordIndex].length
    ) return;


    if (value.endsWith(" ")) {
      if (word === targetWords[currentWordIndex]) {
        setCommittedWords(prev => [...prev, word]);
        setTypedWord("");
      }
    }
    else {
      setTypedWord(value);
    }

    if (gameState === "idle" && word.length === 1) {
      console.log("First letter typed.");
      setGameState("running");
      console.log("Game state set to 'running'");
    }
  }

  const handleRestartClick = () => {
    setFinalWpm(0);
    console.log("Cleared final WPM");
    setGameState("idle");
    console.log("Game state set to 'idle'");
  }

  const getTypingSpeed = (committedWords, typedWord, timeElapsed) => {
    if (timeElapsed <= 0) return 0;

    const words = [...committedWords, typedWord].join(" ");

    const wordsTypedAdjusted = words.length / 5;
    const wpm = Math.round((wordsTypedAdjusted / timeElapsed) * 60 * 100) / 100;

    return wpm;
  }

  const liveWpm = getTypingSpeed(committedWords, typedWord, timeElapsed);

  useEffect(() => {
    if (gameState !== "running") return;

    const startTime = Date.now();

    timerId.current = setInterval(() => {
      const timeNow = Date.now();
      const timePassed = timeNow - startTime;
      const timePassedInSeconds = timePassed / 1000;

      setTimeElapsed(timePassedInSeconds);
    }, 128);

    console.log("Started timer.")

    return () => clearInterval(timerId.current);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "finished") return;

    clearInterval(timerId.current);
    console.log("Stopped timer.")
    setFinalWpm(liveWpm);
    console.log("Stored final WPM.");
    setCommittedWords([]);
    console.log("Cleared committed words.");
    setTypedWord("");
    console.log("Cleared typed word.");
    setTimeElapsed(0);
    console.log("Cleared time elapsed.");
  }, [gameState]);

  useEffect(() => {
    const isLastWordTyped =
      committedWords.length === targetWords.length - 1 &&
      typedWord === targetWords[targetWords.length - 1];
    
    if (isLastWordTyped) {
      console.log("Done!");
      setGameState("finished");
      console.log("Game state set to 'finished'");
    }

  }, [committedWords, typedWord]);

  return (
    <div id="genesis">
      <h1>Welcome to CyberType!</h1>

      {
        gameState === "lobby" ?
          <button
            onClick={() => {
              setGameState("idle")
              console.log("Game state set to 'idle'")
            }}
          >
            Start Game
          </button>
        : <>

            <div id="target">
              {
                targetWords.map((word, index) => {
                  return (
                    <Word
                      key={index}
                      word={word + " "}
                      typedWord={typedWord}
                      wordStatus={
                        index < currentWordIndex ? "done"
                        : index > currentWordIndex ? "untyped"
                        : "current"
                      }
                      currentLetterIndex={currentLetterIndex}
                    />
                  )
                })
              }
            </div>

            {
              gameState !== "finished" &&
              <GameInput
                typedWord={typedWord}
                onChange={handleInputChange}
                isDisabled={gameState === "finished"}
              />
            }
            
            <div>
              Speed (WPM): {gameState === "finished" ? finalWpm : liveWpm}
            </div>

            {
              gameState === "finished" &&
              <button onClick={handleRestartClick}>
                Restart Test
              </button>
            }

          </>
      }
    </div>
  )
}

export default App
