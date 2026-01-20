import { useEffect, useRef, useState } from "react";

export function useTimer(gameState) {
  const [ timeElapsed, setTimeElapsed ] = useState(0);

  const timerId = useRef(null);

  const resetTimer = () => setTimeElapsed(0);
  const stopTimer = () => clearInterval(timerId.current);

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

  return { timeElapsed, resetTimer, stopTimer };
}