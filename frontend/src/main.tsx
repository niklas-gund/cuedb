import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./routes/Layout.tsx";
import "./tailwind.css";
import Signup from "./routes/Signup.tsx";
import Login from "./routes/Login.tsx";
import MovieSearch from "./routes/movies/MovieSearch.tsx";
import { ProtectedRoute } from "./PortectedRoute.tsx";
import ContributorSearch from "./routes/movies/ContributorSearch.tsx";
import EditCueSet from "./routes/cues/EditCueSet.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/search-movie"
            element={
              <ProtectedRoute>
                <MovieSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search-contributor"
            element={
              <ProtectedRoute>
                <ContributorSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-cue-set/:id?"
            element={
              <ProtectedRoute>
                <EditCueSet />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
