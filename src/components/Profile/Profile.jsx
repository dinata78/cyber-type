import styles from "./Profile.module.css";
import { auth } from "../../../firebase";
import { useEffect, useRef, useState } from "react";
import { ProfilePopover } from "../ProfilePopover/ProfilePopover";
import { useAuth } from "../../custom-hooks/useAuth";

export function Profile() {
  const [ isPopoverVisible, setIsPopoverVisible ] = useState(false);

  const mainContainerRef = useRef(null);

  const { logout } = useAuth();

  const closePopover = () => setIsPopoverVisible(false);

  const handleClick = () => {
    setIsPopoverVisible(prev => !prev);
  }

  const handleLogOut = async () => {
    console.log(1)
    const result = await logout();
    console.log(2)

    console.log(result);
  } 

  useEffect(() => {
    if (!isPopoverVisible) return;

    const handleOutsideClick = (e) => {
      if (!mainContainerRef.current) return;
      if (!mainContainerRef.current.contains(e.target)) {
        closePopover();
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    console.log("Profile's handleOutsideClick event attached");

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      console.log("Profile's handleOutsideClick event removed");
    }
  

  }, [isPopoverVisible]);

  return (
    <div ref={mainContainerRef} className={styles.mainContainer}>
      <button
        className={styles.button}
        onClick={handleClick}
      >
        {auth.currentUser?.displayName}
        <span>Matches Played: 0</span>
      </button>

      {
        isPopoverVisible &&
        <ProfilePopover handleLogOut={handleLogOut} />
      }
    </div>
  )
}