import { Navigate } from "react-router-dom";
import { useUserStore } from "./stores/userStore";
import { useGlobalStore } from "./stores/globalStore";

export function ProtectedRoute(props: { children: JSX.Element }) {
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const setBacklink = useGlobalStore((s) => s.setBacklink);
  if (!isLoggedIn) {
    setBacklink(window.location.pathname);
    return <Navigate to="/login" />;
  }
  return props.children;
}
