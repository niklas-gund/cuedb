import { Pool } from "pg";
import { stringToSQLFullTextQuery } from "./tools";

export async function addContributor(
  tmdb_id: string,
  name: string,
  user: SessionInfo,
  pool: Pool
) {
  if (user.permissions.perm_add_contributor) {
    const row = await pool.query(
      "INSERT INTO contributors (name, tmdb_id) VALUES ($1, $2) RETURNING ID",
      [name, tmdb_id]
    );
    return String(row.rows[0].id);
  } else {
    throw new Error("User is not allowed to add contributors");
  }
}

export async function searchLocalContributor(query: string, pool: Pool) {
  const cleanedQuery = stringToSQLFullTextQuery(query)
  const results = await pool.query(
    `SELECT title, tmdb_id FROM movies 
     WHERE to_tsvector('english', title) @@ to_tsquery('english', $1)`,
    [cleanedQuery]
  );
  return results.rows;
}
