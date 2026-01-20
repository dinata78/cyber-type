
export function useQuote() {
  const target = "I don't really know yet, so please don't ask me.";
  const targetWords = target.split(" ");

  return { targetWords };
}