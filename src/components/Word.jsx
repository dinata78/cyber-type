import { Letter } from "./Letter";

export function Word({ word, typedWord, wordStatus, currentLetterIndex }) {
  const letters = word.split("");

  return (
    <div className="word">
      {
        letters.map((letter, index) => {
          let status = "letter";

          if (wordStatus === "done") {
            status = "correct"
          }
          else if (wordStatus === "current") {
            if (index < currentLetterIndex) {
              status = letter === typedWord[index] ? "correct" : "incorrect"
            }
            else if (index === currentLetterIndex) {
              status = "current";
            }
          }

          return (
            <Letter
              key={index}
              letter={letter}
              status={status}
            />
          )
        })
      }
    </div>
  );
}