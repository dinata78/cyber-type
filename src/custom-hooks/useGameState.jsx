import { useState } from "react";

export function useGameState() {
  const [ gameState, setGameState ] = useState("idle");

  const gameIdle = () => setGameState("idle");
  const gameRunning = () => setGameState("running");
  const gameFinished = () => setGameState("finished");

  return {
    gameState,
    gameIdle,
    gameRunning,
    gameFinished,
  }
}