import styles from "./Header.module.css";
import { useNavigate } from "react-router-dom";
import { NavLink } from "../NavLink/NavLink";
import { UserSearch } from "../UserSearch/UserSearch";
import { Auth } from "../../auth/Auth/Auth";
import { Profile } from "../Profile/Profile";
import { useAuth } from "../../../custom-hooks/useAuth";

export function Header() {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const query = formData.get("query").trim();

    if (!query) return;

    const currentPath = window.location.pathname.toLowerCase();
    const newPath = `/user/${query.toLowerCase()}`;

    if (currentPath !== newPath) {
      navigate(newPath);
    }

    form.reset();
    document.activeElement.blur();
  }

  return (
    <header className={styles.mainContainer}>
      <NavLink
        to={"/"}
        className={styles.logo}
      >
        CYBERTYPE
      </NavLink>

      <NavLink
        to={"/"}
        className={styles.navLink}
      >
        LOBBY
      </NavLink>

      <NavLink
        to={"/forum"}
        className={styles.navLink}
      >
        FORUM
      </NavLink>

      <NavLink
        to={"/leaderboard"}
        className={styles.navLink}
      >
        LEADERBOARD
      </NavLink>

      <UserSearch onSubmit={handleSearchSubmit} />

      { !isAuthenticated ? <Auth /> : <Profile /> }
    </header>
  )
}