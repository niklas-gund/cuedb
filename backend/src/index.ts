import dotenv from "dotenv";
import express from "express";
import { Pool } from "pg";
import { runDBScript } from "./database/dbscript";

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
  });

app.get("/", async (req, res) => {
  try {
    const roles = await pool.query(`SELECT * FROM roles`);
    res.send(roles.rows);
  } catch (error) {
    res.send(error);
  }
});

app.get("/api/jens", (req, res) => {
  res.send("Jens endpoint!!!!!");
});

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});
