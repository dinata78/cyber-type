import { auth, db, functions } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

export function useAuth() {
  const login = async (username, password) => {
    try {
      const usernameKey = username.replaceAll(/\s+/g, " ").trim().toLowerCase();
      const usernamesDoc = await getDoc(doc(db, "usernames", usernameKey));

      if (!usernamesDoc.exists()) {
        return {
          ok: false,
          error: "auth/username-not-found",
        }
      }

      const uid = usernamesDoc.data().uid;
      const usersDoc = await getDoc(doc(db, "users", uid));

      if (!usersDoc.exists()) {
        return {
          ok: false,
          error: "user-data-not-found",
        }
      }
      else {
        await signInWithEmailAndPassword(
          auth,
          usersDoc.data().email,
          password,
        );
        return {
          ok: true,
        }
      }
    }
    catch (error) {
      return {
        ok: false,
        error: error.code,
      }
    }
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const username = formData.get("username");
    const password = formData.get("password");

    const result = await login(username, password);

    console.log(result);
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
    }
  }

  return { handleLoginSubmit, handleSignupSubmit }
}