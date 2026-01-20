import { useRef } from "react";

export function useMistakes() {
  const mistakesCount = useRef(0);
  const incrementMistakes = () => {
    mistakesCount.current += 1;
  }
  const resetMistakes = () => {
    mistakesCount.current = 0;
  }

  return {
    getMistakes: () => mistakesCount.current,
    incrementMistakes,
    resetMistakes,
  };
}