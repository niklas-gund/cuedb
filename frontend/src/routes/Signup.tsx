import APIConnector from "../APIConnector";
import UsernamePasswordForm from "../components/UsernamePasswordForm";

export default function Signup() {
  const signup = async (username: string, password: string) => {
    const res = await APIConnector.signup({ username, password });
    alert(JSON.stringify(res));
    console.log(res);
  };
  return <UsernamePasswordForm title="Sign up" onSubmit={signup} />;
}
