import styles from "./NavLink.module.css";
import { Link } from "react-router-dom";

export function NavLink({ to, children, className }) {
  return (
    <Link to={to} className={`${styles.link} ${className ?? ""}`}>
      {children}
    </Link>
  )
}