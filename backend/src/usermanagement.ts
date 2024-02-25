import { compare } from "bcrypt";
import { Pool } from "pg";

export async function addUser(
  username: string,
  password: string,
  pool: Pool
): Promise<[boolean, string]> {
  try {
    // check if username exists
    const usersOfName = await pool.query(
      "SELECT * FROM users WHERE username=$1",
      [username]
    );
    if (usersOfName.rowCount != 0) {
      throw new Error("Username Exists");
    }
    // get default role
    const role = (await pool.query(`SELECT id FROM roles WHERE name='default'`))
      .rows[0].id;

    await pool.query(
      `INSERT INTO users (username, role, password_hash, created_at) VALUES($1,$2,$3,NOW())`,
      [username, role, password]
    );
    return [true, ""];
  } catch (error) {
    return [false, String(error)];
  }
}

export async function login(
  username: string,
  password: string,
  pool: Pool
): Promise<{ userInfo: UserInfo; session: string; maxAge: number }> {
  const users = await pool.query(
    `SELECT id, role, password_hash FROM users WHERE username = $1`,
    [username]
  );
  if (users.rowCount == 0) {
    throw new Error("Wrong username or password incorrect");
  }
  const passwordMatch = await compare(password, users.rows[0].password_hash);
  if (!passwordMatch) throw new Error("Wrong username or password incorrect");
  // get permissions
  const permissionRows = await pool.query(
    `SELECT perm_add_movie, perm_submit_set, perm_review_set, perm_user_rights_management, perm_add_contributor 
     FROM roles WHERE id=$1`,
    [users.rows[0].role]
  );

  const permissions: CuePermissions = {
    perm_add_movie: permissionRows.rows[0].perm_add_movie,
    perm_submit_set: permissionRows.rows[0].perm_submit_set,
    perm_review_set: permissionRows.rows[0].perm_review_set,
    perm_user_rights_management:
      permissionRows.rows[0].perm_user_rights_management,
    perm_add_contributor: permissionRows.rows[0].perm_add_contributor,
  };

  const maxAge = 12 * 60 * 60 * 1000;
  // add session
  const session = await pool.query(
    `INSERT INTO sessions (user_id, expires) VALUES ($1, to_timestamp($2)) RETURNING id`,
    [users.rows[0].id, Date.now() + maxAge]
  );
  return {
    userInfo: {
      username,
      permissions,
    },
    session: session.rows[0].id,
    maxAge,
  };
}
