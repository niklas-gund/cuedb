import dotenv from "dotenv";
import express from "express";
import { Pool } from "pg";
import { runDBScript } from "./database/dbscript";
import { StandardResponseWriter, checkSession, parseQuery } from "./tools";
import { genSalt, hash } from "bcrypt";
import { addUser, login } from "./usermanagement";
import { runMigrations } from "./database/migrations";
import { searchMovies, searchPerson } from "./TMDBConnector";
import { addMovie, searchLocalMovies } from "./moviemanagement";
import { addContributor } from "./contributors";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 11111;

const pool = new Pool({
  host: "data",
  user: "cuedb",
  max: 20,
  password: "cuedb",
  database: "cuedb",
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

let db_version = -1;

pool
  .query(`SELECT * FROM db_version ORDER BY db_version DESC`)
  .then((res) => {
    db_version = parseInt(res.rows[0].db_version);
  })
  .catch((error) => {
    // error is relations does not exists
    if (error.code == "42P01") {
      console.log("DB seems empty, running dbscript");
      runDBScript(pool).then((r) => console.log(r, "DB Initialized"));
      return;
    }
    console.error(error);
    process.exit(2378);
  })
  .finally(() => {
    runMigrations(pool);
  });

app.get("/", async (req, res) => {
  try {
    const roles = await pool.query(`SELECT * FROM roles`);
    res.send(roles.rows);
  } catch (error) {
    res.send(error);
  }
});

app.get("/api/signup", async (req, res) => {
  try {
    const { username, password } = parseQuery(req, ["username", "password"]);
    if (username.length < 4) {
      throw new Error("Username must have at least 4 characters");
    }
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    const salt = await genSalt(10);
    const hashedPW = await hash(password, salt);
    const [success, error] = await addUser(username, hashedPW, pool);
    if (success) {
      res.json(StandardResponseWriter.success(true));
    } else {
      res.json(StandardResponseWriter.error(error));
    }
  } catch (error) {
    res.json(StandardResponseWriter.error(String(error)));
  }
});

app.get("/api/login", async (req, res) => {
  try {
    const { username, password } = parseQuery(req, ["username", "password"]);
    const loginRes = await login(username, password, pool);
    res.cookie("cuedb-token", loginRes.session, {
      path: "/",
      maxAge: loginRes.maxAge,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    res.json(StandardResponseWriter.success(loginRes.userInfo));
  } catch (error) {
    res.json(StandardResponseWriter.error(String(error)));
  }
});

app.get("/api/movies/search", async (req, res) => {
  try {
    const { query } = parseQuery(req, ["query"]);
    const userInfo = await checkSession(req, pool);
    if (userInfo.permissions.perm_add_movie) {
      const result = await searchMovies(query);
      res.json(StandardResponseWriter.success(result));
    }
  } catch (error) {
    res.json(StandardResponseWriter.error(String(error)));
  }
});

app.get("/api/movies/search-local", async (req, res) => {
  try {
    const { query } = parseQuery(req, ["query"]);
    const result = await searchLocalMovies(query, pool);
    res.json(StandardResponseWriter.success(result));
  } catch (error) {
    res.json(StandardResponseWriter.error(String(error)));
  }
});

app.get("/api/movies/add", async (req, res) => {
  try {
    const { tmdbID, title } = parseQuery(req, ["tmdbID", "title"]);
    const userInfo = await checkSession(req, pool);
    await addMovie(tmdbID, title, userInfo, pool);
    res.json(StandardResponseWriter.success(true));
  } catch (error) {
    res.json(StandardResponseWriter.error(String(error)));
  }
});

app.get("/api/people/search", async (req, res) => {
  try {
    const { query } = parseQuery(req, ["query"]);
    const userInfo = await checkSession(req, pool);
    if (userInfo.permissions.perm_add_contributor) {
      const result = await searchPerson(query);
      res.json(StandardResponseWriter.success(result));
    }
  } catch (error) {
    res.json(StandardResponseWriter.error(String(error)));
  }
});

app.get("/api/people/add", async (req, res) => {
  try {
    const { tmdbID, name } = parseQuery(req, ["tmdbID", "name"]);
    const userInfo = await checkSession(req, pool);
    await addContributor(tmdbID, name, userInfo, pool);
    res.json(StandardResponseWriter.success(true));
  } catch (error) {
    res.json(StandardResponseWriter.error(String(error)));
  }
});

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});
