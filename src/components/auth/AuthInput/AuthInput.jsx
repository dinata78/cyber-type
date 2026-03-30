import styles from "./AuthInput.module.css";

export function AuthInput({ type, name, label }) {
  return (
    <div className={styles.mainContainer}>
      <label
        className={styles.label}
        htmlFor={name}
      >
        {label}
      </label>
      
      <input
        className={styles.input}
        id={name}
        type={type}
        name={name}
      />
    </div>
  )
}