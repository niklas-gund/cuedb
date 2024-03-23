import { useNavigate } from "react-router-dom";
import APIConnector from "../APIConnector";
import UsernamePasswordForm from "../components/UsernamePasswordForm";
import { useGlobalStore } from "../stores/globalStore";
import { useUserStore } from "../stores/userStore";

/**
 * This refactored version of the Login component adds better error handling and defensive programming.
 *
 * The changes made include:
 * - Early return to avoid unnecessary processing when username or password is undefined.
 * - Try-catch block to catch and log any errors that occur during the login process.
 * - Check for undefined value of backlink before navigating to it.
 */
export default function Login() {
  const userStore = useUserStore();
  const globalStore = useGlobalStore();
  const backlink = useGlobalStore((s) => s.backlink);
  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    if (username === undefined || password === undefined) {
      console.error("Username or password is undefined");
      return;
    }

    try {
      const res = await APIConnector.login({ username, password });

      if (res.status !== "success") {
        console.error("Login failed:", res.content);
        return;
      }

      userStore.setIsLoggedIn(true);
      userStore.setUsername(res.content.username);
      userStore.setAccessRights(res.content.permissions);

      if (backlink) {
        navigate(backlink);
        globalStore.setBacklink("");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return <UsernamePasswordForm title="Login" onSubmit={login} />;
}
