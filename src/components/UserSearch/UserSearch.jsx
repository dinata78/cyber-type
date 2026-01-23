import styles from "./UserSearch.module.css";

export function UserSearch({ onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <input
        className={styles.input}
        type="search"
        name="query"
        placeholder="Search for players..."
      />
    </form>
  )
}