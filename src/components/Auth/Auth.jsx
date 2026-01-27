import styles from "./Auth.module.css";
import { useEffect, useRef, useState } from "react";
import { AuthPopover } from "../AuthPopover/AuthPopover";
import { AuthButton } from "../AuthButton/AuthButton";
import { useAuth } from "../../custom-hooks/useAuth";
import { auth, functions } from "../../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { httpsCallable } from "firebase/functions";

export function Auth() {
  const [ popoverState, setPopoverState ] = useState("closed");

  const mainContainerRef = useRef(null);

  const { login } = useAuth();

  const closePopover = () => setPopoverState("closed");

  const handleLogInClick = () => setPopoverState("login");
  const handleSignUpClick = () => setPopoverState("signup");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const username = formData.get("username");
    const password = formData.get("password");

    const result = await login(username, password);

    console.log(result);

    if (result.ok) {
      closePopover();
    }
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email");
    const username = formData.get("username");
    const password = formData.get("password");

    const signup = httpsCallable(functions, "signup");

    const result = await signup({ email, username, password });

    console.log(result.data);

    if (result.data.ok) {
      await signInWithEmailAndPassword(
        auth,
        email,
        password,
      )
      closePopover();
    }
  }

  useEffect(() => {
    if (popoverState === "closed") return;

    const handleOutsideClick = (e) => {
      if (!mainContainerRef.current) return;
      if (!mainContainerRef.current.contains(e.target)) {
        closePopover();
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    console.log("Auth handleOutsideClick event attached");

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      console.log("Auth handleOutsideClick event removed");
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