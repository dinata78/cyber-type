
export function Letter({ typed, position, letter }) {
  return (
    <p
      className={
        position < typed.length && letter === typed[position] ? "letter correct"
        : position < typed.length && letter !== typed[position] ? "letter incorrect"
        : position === typed.length ? "letter current"
        : "letter"
      }
    >
      {letter}
    </p>
  )
}