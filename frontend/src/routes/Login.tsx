import APIConnector from "../APIConnector";
import UsernamePasswordForm from "../components/UsernamePasswordForm";

export default function Login() {
  const login = async (username: string, password: string) => {
    const res = await APIConnector.login({ username, password });
    alert(JSON.stringify(res));
  };

  return <UsernamePasswordForm title="Login" onSubmit={login} />;
}
