
export function Letter({ typed, position, letter }) {
  return (
    <p
      className={
        typed[position] === undefined ? "letter"
        : letter === typed[position] ? "letter correct"
        : "letter incorrect"}
    >
      {letter}
    </p>
  )
}