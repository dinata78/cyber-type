import styles from "./Auth.module.css";
import { useEffect, useRef, useState } from "react";
import { AuthPopover } from "../AuthPopover/AuthPopover";
import { AuthButton } from "../AuthButton/AuthButton";
import { useAuth } from "../../custom-hooks/useAuth";

export function Auth() {
  const [ popoverState, setPopoverState ] = useState("closed");

  const mainContainerRef = useRef(null);

  const handleLogInClick = () => setPopoverState("login");
  const handleSignUpClick = () => setPopoverState("signup");

  const closePopover = () => setPopoverState("closed");

  const { handleLoginSubmit, handleSignupSubmit } = useAuth();

  useEffect(() => {
    if (popoverState === "closed") return;

    const handleOutsideClick = (e) => {
      if (!mainContainerRef.current) return;
      if (!mainContainerRef.current.contains(e.target)) {
        closePopover();
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    console.log("handleOutsideClick event attached");

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      console.log("handleOutsideClick event removed");
    }
  }, [popoverState]);

  return (
    <div
      ref={mainContainerRef}
      className={styles.mainContainer}
    >
      <AuthButton
        popoverState={popoverState}
        handleLogInClick={handleLogInClick}
        handleSignUpClick={handleSignUpClick}
      />

      {
        popoverState !== "closed" &&
        <AuthPopover
          popoverState={popoverState}
          onLoginSubmit={handleLoginSubmit}
          onSignupSubmit={handleSignupSubmit}
        />
      }
    </div>
  )
}