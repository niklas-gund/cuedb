import { Pool } from "pg";
import { stringToSQLFullTextQuery } from "./tools";
import { getContributorByID } from "./TMDBConnector";

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
  const cleanedQuery = stringToSQLFullTextQuery(query);
  const results = await pool.query(
    `SELECT name, tmdb_id FROM contributors 
     WHERE to_tsvector('english', name) @@ to_tsquery('english', $1)`,
    [cleanedQuery]
  );
  //!
  console.log(results.rows);
  // fill in data
  const persons = await Promise.all(
    results.rows.map(async (r) => await getContributorByID(r.tmdb_id))
  );
  return persons;
}
