
export function Letter({ letter, status }) {
  return (
    <p
      className={
        status === "correct" ? "letter correct"
        : status === "incorrect" ? "letter incorrect"
        : status === "current" ? "letter current"
        : "letter"
      }
    >
      {letter}
    </p>
  )
}