import { useEffect, useRef } from "react"

export function GameInput({ typed, onChange, isDisabled }) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
    console.log("Focused input.")
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      disabled={isDisabled}
      onChange={onChange}
      value={typed}
    />
  )
}