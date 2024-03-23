import { Pool } from "pg";

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
