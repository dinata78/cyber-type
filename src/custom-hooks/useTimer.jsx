import { useEffect, useRef, useState } from "react";

export function useTimer(gameState) {
  const [ startTime, setStartTime ] = useState(0);
  const [ timeElapsed, setTimeElapsed ] = useState(0);

  const timerId = useRef(null);

  const resetStartTime = () => setStartTime(0);
  const resetTimer = () => setTimeElapsed(0);
  const stopTimer = () => clearInterval(timerId.current);

  useEffect(() => {
    if (gameState !== "running") return;

    const startTime = Date.now();
    setStartTime(startTime);

    timerId.current = setInterval(() => {
      const timeNow = Date.now();
      const timePassed = timeNow - startTime;
      const timePassedInSeconds = timePassed / 1000;

      setTimeElapsed(timePassedInSeconds);
    }, 512);

    console.log("Started timer.")

    return () => clearInterval(timerId.current);
  }, [gameState]);

  return { startTime, timeElapsed, resetStartTime, resetTimer, stopTimer };
}