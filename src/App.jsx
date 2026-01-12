import { useEffect, useRef, useState } from "react"
import "./index.css"
import { Letter } from "./Letter";

function App() {
  const [ typed, setTyped ] = useState("");
  const [ timeElapsed, setTimeElapsed ] = useState(0);
  const [ typingSpeed, setTypingSpeed ] = useState(0);
  
  const target = "I don't really know yet, so please don't ask me.";
  const targetArray = target.split("");

  const timerId = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const startTime = Date.now();

    timerId.current = setInterval(() => {
      const timeNow = Date.now();
      const timePassed = timeNow - startTime;
      const timePassedInSeconds = timePassed / 1000;

      setTimeElapsed(timePassedInSeconds);
    }, 128);

    return () => clearInterval(timerId.current);
  }, []);

  useEffect(() => {
    if (timeElapsed < 0.5) return;

    const wordsTyped = typed.length / 5;
    const wpm = wordsTyped / timeElapsed * 60;
    const roundedWpm = Math.round(wpm * 100) / 100; 
    setTypingSpeed(roundedWpm);
  }, [typed, timeElapsed]);

  useEffect(() => {
    if (typed === target) {
      console.log("Done!")
      clearInterval(timerId.current);
      timerId.current = null;
    }
  }, [typed])

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  return (
    <div id="genesis">
      <h1>Welcome to CyberType!</h1>

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

      <input
        ref={inputRef}
        type="text"
        onChange={(e) => setTyped(e.target.value)}
        value={typed}
      />
      <div>Speed (WPM): {typingSpeed}</div>

    </div>
  )
}

export default App
