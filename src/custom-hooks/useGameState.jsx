import { useState } from "react";

export function useGameState() {
  const [ gameState, setGameState ] = useState("idle");

  const setGameIdle = () => setGameState("idle");
  const setGameRunning = () => setGameState("running");
  const setGameFinished = () => setGameState("finished");

  return {
    gameState,
    setGameIdle,
    setGameRunning,
    setGameFinished,
  }
}