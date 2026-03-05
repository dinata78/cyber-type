import { useState } from "react";

export function useMistakes() {
  const [ mistakes, setMistakes ] = useState(0);

  const incrementMistakes = () => {
    setMistakes(prev => prev + 1);
  }

  const resetMistakes = () => {
    setMistakes(0);
  }

  return {
    mistakes,
    incrementMistakes,
    resetMistakes,
  };
}