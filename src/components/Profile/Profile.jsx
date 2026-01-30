import styles from "./Profile.module.css";
import { useEffect, useRef, useState } from "react";
import { ProfilePopover } from "../ProfilePopover/ProfilePopover";
import { useAuth } from "../../custom-hooks/useAuth";
import { useNavigate } from "react-router-dom";

export function Profile() {
  const [ isPopoverVisible, setIsPopoverVisible ] = useState(false);
  const [ isLoggingOut, setIsLoggingOut ] = useState(false);

  const navigate = useNavigate();

  const mainContainerRef = useRef(null);

  const { userRecord, logout } = useAuth();

  const closePopover = () => setIsPopoverVisible(false);

  const handleClick = () => {
    setIsPopoverVisible(prev => !prev);
  }

  const handleProfileClick = () => {
    closePopover();
    navigate(`/user/${userRecord.displayName}`)
  }

  const handleLogOutClick = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    const result = await logout();

    setIsLoggingOut(false);

    console.log(result);

    if (result.ok) closePopover();
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
    console.log("Profile handleOutsideClick event attached");

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      console.log("Profile handleOutsideClick event removed");
    }
  

  }, [isPopoverVisible]);

  return (
    <div ref={mainContainerRef} className={styles.mainContainer}>
      <button
        className={styles.button}
        onClick={handleClick}
      >
        {userRecord?.displayName || "Loading..."}
        <span>Matches Played: 0</span>
      </button>

      {
        isPopoverVisible &&
        <ProfilePopover
          handleProfileClick={handleProfileClick}
          handleLogOutClick={handleLogOutClick}
          isLoggingOut={isLoggingOut}
        />
      }
    </div>
  )
}