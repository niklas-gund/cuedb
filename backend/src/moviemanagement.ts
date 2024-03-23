import { Pool } from "pg";
import { getSingleMovie } from "./TMDBConnector";

export async function addMovie(
  tmdbID: string,
  title: string,
  user: SessionInfo,
  pool: Pool
) {
  if (user.permissions.perm_add_movie) {
    const row = await pool.query(
      "INSERT INTO movies (title, tmdb_id, added_at, added_by) VALUES ($1, $2, NOW(), $3) RETURNING ID",
      [title, tmdbID, user.userID]
    );
    return String(row.rows[0].id);
  } else {
    throw new Error("User is not allowed to add movies");
  }
}

export async function searchLocalMovies(query: string, pool: Pool) {
  const cleanedQuery = query
    .split(" ")
    .map((word) => word.replace(/[^a-zA-Z0-9]/g, ""))
    .join(" & ");
  const results = await pool.query(
    `SELECT title, tmdb_id FROM movies 
     WHERE to_tsvector('english', title) @@ to_tsquery('english', $1)`,
    [cleanedQuery]
  );
  const movies = await Promise.all(
    results.rows.map(async (r) => await getSingleMovie(r.tmdb_id))
  );
  return movies;
}
