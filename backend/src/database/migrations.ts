import { Pool } from "pg";

export type MigrationEntry = {
  from: number;
  to: number;
  migrationFunction: (pool: Pool) => Promise<void>;
};

export async function runMigrations(pool: Pool) {
  const getDBVersion = async () => {
    return (await pool.query("SELECT db_version FROM db_version")).rows[0]
      .db_version as number;
  };

  while (true) {
    const currentVersion = await getDBVersion();
    const migrationScripts = MIGRATIONS.filter((m) => m.from == currentVersion);
    if (migrationScripts.length == 0) {
      console.log("Migration Done");
      return;
    } else if (migrationScripts.length > 1) {
      throw new Error("More than one migration script from this version");
    } else {
      console.log("Starting migration to version " + migrationScripts[0].to);
      await migrationScripts[0].migrationFunction(pool);
      await pool.query("UPDATE db_version SET db_version = $1", [
        migrationScripts[0].to,
      ]);
    }
  }
}

export const MIGRATIONS: MigrationEntry[] = [
  {
    from: 1,
    to: 2,
    migrationFunction: async (pool) => {
      await pool.query(`
    CREATE TABLE "sessions" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "user_id" UUID REFERENCES users(id),
      "expires" timestamp 
    )
    `);
    },
  },
  {
    from: 2,
    to: 3,
    migrationFunction: async (pool) => {
      // add unique constrain to tmdb_id in movies and contributors
      await pool.query(`
      ALTER TABLE movies ADD CONSTRAINT movies_tmdb_id_unique UNIQUE (tmdb_id);
      ALTER TABLE contributors ADD CONSTRAINT contributors_tmdb_id_unique UNIQUE (tmdb_id);
      `);
    },
  },
];
