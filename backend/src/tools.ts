import { Request } from "express";
import { Pool, PoolClient } from "pg";
import { getUserPermissions } from "./usermanagement";

export class StandardResponseWriter {
  public static success(responseObject: unknown): StandardResponse {
    return { status: "success", content: responseObject };
  }
  public static error(errorString: string): StandardResponse {
    return { status: "error", error: errorString };
  }
}

export function parseQuery<T extends string>(
  req: Request,
  args: T[]
): Record<T, string> {
  const parsedStrings = {} as Record<T, string>;
  for (const param of args) {
    const parsed = req.query[param]?.toString();
    if (parsed == undefined) throw new Error(`Missing parameter: ${param}`);
    else parsedStrings[param] = parsed;
  }
  return parsedStrings;
}

export const ERROR_NOT_AUTHENTICATED = new Error("Not Authenticated");
export const ERROR_SESSION_EXPIRED = new Error("Session Expired");
export async function checkSession(
  req: Request,
  pool: Pool
): Promise<SessionInfo> {
  const cookies = parseCookies(req);
  if (!cookies.has("cuedb-token")) {
    throw ERROR_NOT_AUTHENTICATED;
  }
  const sessionRows = await pool.query(
    `SELECT user_id, expires FROM sessions WHERE expires > CURRENT_TIMESTAMP AND id = $1`,
    [cookies.get("cuedb-token")]
  );
  if (sessionRows.rowCount == 0) {
    throw ERROR_SESSION_EXPIRED;
  }
  const userID = sessionRows.rows[0].user_id as string;
  const userRows = await pool.query(
    "SELECT username, role FROM users WHERE id = $1",
    [userID]
  );
  if (userRows.rowCount != 1) {
    throw new Error(`User not found: ${userID}`); // should never happen with db restrictions
  }
  const permissions = await getUserPermissions(pool, userRows.rows[0].role);
  return {
    userID,
    username: userRows.rows[0].username,
    permissions,
  };
}

function parseCookies(req: Request) {
  const cookie = req.headers.cookie;
  const cookieList = cookie?.split("; ") ?? [];
  const cookies = new Map<string, string>();
  cookieList.forEach((c) => {
    const split = c.split("=");
    cookies.set(split[0], split[1]);
  });
  return cookies;
}

export function stringToSQLFullTextQuery(input: string) {
  return input
    .split(" ")
    .map((word) => word.replace(/[^a-zA-Z0-9]/g, ""))
    .join(" & ");
}

export const tx = async (
  pool: Pool,
  callback: (client: PoolClient) => Promise<void>
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    try {
      await callback(client);
      await client.query("COMMIT");
    } catch (e) {
      console.error(e);
      await client.query("ROLLBACK");
    }
  } finally {
    client.release();
  }
};
