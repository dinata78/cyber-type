import styles from "./Auth.module.css";
import { useEffect, useRef, useState } from "react";
import { signInWithCustomToken, signInWithEmailAndPassword } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { auth, functions } from "../../../../firebase"
import { AuthPopover } from "../AuthPopover/AuthPopover";
import { AuthButton } from "../AuthButton/AuthButton";
import { getErrorMessage } from "./getErrorMessage";
import { useAuth } from "../../../custom-hooks/useAuth"

export function Auth() {
  const [ popoverState, setPopoverState ] = useState("closed");
  const [ errorMessage, setErrorMessage ] = useState("");
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  const mainContainerRef = useRef(null);

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

    if (!username || !password) {
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

    setIsSubmitting(true);

    try {
      const getLoginToken = httpsCallable(functions, "getLoginToken");
      const result = await getLoginToken({ username, password });
      
      if (!result.data.ok) {
        setErrorMessage(getErrorMessage(result.data.code));
        return;
      }

      const loginToken = result.data.loginToken;

      await signInWithCustomToken(auth, loginToken);

      console.log("Login success.");
    }
    catch (e) {
      console.error(e);
    }
    finally {
      setIsSubmitting(false);
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
    
    setIsSubmitting(true);
    
    try {
      const signup = httpsCallable(functions, "signup");
      const result = await signup({
        email,
        username,
        password
      });

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
    catch (e) {
      console.error(e);
      setErrorMessage(getErrorMessage("INTERNAL_SERVER_ERROR"))
    }
    finally {
      setIsSubmitting(false);
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