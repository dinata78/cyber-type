import styles from "./Auth.module.css";
import { useEffect, useRef, useState } from "react";
import { AuthPopover } from "../AuthPopover/AuthPopover";
import { AuthButton } from "../AuthButton/AuthButton";
import { useAuth } from "../../custom-hooks/useAuth";
import { auth, functions } from "../../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { useErrorMessages } from "../../custom-hooks/useErrorMessages";

export function Auth() {
  const [ popoverState, setPopoverState ] = useState("closed");
  const [ errorMessage, setErrorMessage ] = useState("");
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  const mainContainerRef = useRef(null);

  const { login } = useAuth();

  const { getErrorMessage } = useErrorMessages();

  const closePopover = () => setPopoverState("closed");

  const handleLogInClick = () => setPopoverState("login");
  const handleSignUpClick = () => setPopoverState("signup");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    const username = formData.get("username");
    const password = formData.get("password");

    setIsSubmitting(true);

    const result = await login(username, password);

    setIsSubmitting(false);

    console.log(result);

    if (result.ok) {
      closePopover();
    }
    else {
      setErrorMessage(getErrorMessage(result.code));
    }
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email");
    const username = formData.get("username");
    const password = formData.get("password");

    if (!email || !username || !password) {
      setErrorMessage(getErrorMessage("EMPTY_FIELDS"));
      return;
    }

    if (username.length > 16) {
      setErrorMessage(getErrorMessage("INVALID_USERNAME_LENGTH"));
      return;
    }

    if (password.length < 8 || password.length > 64) {
      setErrorMessage(getErrorMessage("INVALID_PASSWORD_LENGTH"));
      return;
    }

    const signup = httpsCallable(functions, "signup");

    setIsSubmitting(true);

    const result = await signup({ email, username, password });

    setIsSubmitting(false);

    console.log(result.data);

    if (result.data.ok) {
      await signInWithEmailAndPassword(
        auth,
        email,
        password,
      )
      closePopover();
    }
    else {
      setErrorMessage(getErrorMessage(result.data.code));
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

  useEffect(() => {
    setErrorMessage("");
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
          errorMessage={errorMessage}
          isSubmitting={isSubmitting}
        />
      }
    </div>
  )
}