import { PaperAirplaneIcon } from "@heroicons/react/16/solid";
import LogoSVG from "../assets/logo.svg";
import { useUserStore } from "../stores/userStore";
import { useState } from "react";

export default function Signup() {
  const userStore = useUserStore();
  const singup = () => {
    userStore.setUsername(username);
    userStore.setIsLoggedIn(true);
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="py-4">
      <div className="w-128 mx-auto bg-gradient-to-br from-navy-950 to-navy-800 text-white flex flex-col pt-2 pb-1 rounded-lg shadow-lg">
        <img className="w-32 my-4 mx-auto" src={LogoSVG} alt="logo" />
        <h1 className="font-semibold text-2xl mx-auto pb-2">Sign up</h1>
        <div className="bg-white mx-1 text-gray-700 p-2 rounded-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              singup();
            }}
          >
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
            />
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
            />
            <div className="flex mt-4">
              <button
                type="submit"
                className="bg-navy-800 text-white font-bold px-4 py-2 rounded flex items-center gap-2 ml-auto"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
                <div className="text-nowrap">Sign up</div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
