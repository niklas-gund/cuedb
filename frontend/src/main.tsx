import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./routes/ErrorPage.tsx";
import Layout from "./routes/Layout.tsx";
import "./tailwind.css";
import Signup from "./routes/Signup.tsx";
import Login from "./routes/Login.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <div className="p-6">Home</div> },
      { path: "/about", element: <div>ABOUT</div> },
      { path: "/signup", element: <Signup /> },
      { path: "/login", element: <Login /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
