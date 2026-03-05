import { useState } from "react";

const quotes = [
  {
    text: "Pain and suffering are always inevitable for a large intelligence and a deep heart.",
    origin: "Crime and Punishment",
    difficulty: "Easy",
  },
  {
    text: "Every person is trapped in their own particular bubble of delusion, and it's every person's task in life to break free. Books can help. We can make the past into the present, take you back in time and help you remember. We can show you things, shift your realities and widen your world, but the work of waking up is up to you.",
    origin: "The Book of Form and Emptiness",
    difficulty: "Medium",
  },
  {
    text: "There is something at the bottom of every new human thought, every thought of genius, or even every earnest thought that springs up in any brain, which can never be communicated to others, even if one were to write volumes about it and were explaining one's idea for thirty-five years; there's something left which cannot be induced to emerge from your brain, and remains with you forever; and with it you will die, without communicating to anyone perhaps the most important of your ideas.",
    origin: "The Idiot",
    difficulty: "Hard",
  }
];

export function useQuote() {
  const [quote, setQuote] = useState(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);

    return quotes[randomIndex];
  });

  const pickNewQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);

    setQuote(quotes[randomIndex]);
  };

  return {
    text: quote.text,
    origin: quote.origin,
    difficulty: quote.difficulty,
    pickNewQuote,
  };
}