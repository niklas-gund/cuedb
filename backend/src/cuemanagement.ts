import { Pool } from "pg";
import { tx } from "./tools";

export async function createCueSet(cueSet: FrontendCueSet, pool: Pool) {
  const backendCues = cueSet.cues.map(
    (c, index) => ({ ...c, rank: index } as BackendCue)
  );
  const client = pool.connect();

  await tx(pool, async (client) => {
    // add cues first
    for (const cue of backendCues) {
      await client.query(
        `INSERT INTO cues (id, rank, slate, title) VALUES ($1, $2, $3, $4)`,
        [cue.id, cue.rank, cue.slate, cue.title]
      );
    }
    // add cue set
    const movieReverseLookup = await client.query(
      "SELECT id FROM movies WHERE tmdb_id = $1",
      [cueSet.movieID]
    );
    if (movieReverseLookup.rowCount !== 1)
      throw new Error("Movie id not found!!!");
    const movieIDLocal = movieReverseLookup.rows[0].id;
    const cueSetID = (
      await client.query(
        `INSERT INTO cue_sets (cue_source, movie, submitted_at) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING id`,
        [cueSet.cueSource, movieIDLocal]
      )
    ).rows[0].id;
    // add cues into set
    for (const cue of backendCues) {
      await client.query(`INSERT INTO cues_in_set (cue, set) VALUES ($1,$2)`, [
        cue.id,
        cueSetID,
      ]);
    }
    const contributorCache = new Map<string, string>();
    const getContributorID = async (tmdb_id: string) => {
      const cachedID = contributorCache.get(tmdb_id);
      if (cachedID) return cachedID;
      // lookup in db
      const results = await client.query(
        `SELECT id FROM contributors WHERE tmdb_id = $1`,
        [tmdb_id]
      );
      const localID = results.rows[0].id;
      if (typeof localID !== "string")
        throw new Error("Could not get contributor id");
      contributorCache.set(tmdb_id, localID);
      return localID;
    };
    // add composers and orchestrators
    for (const cue of backendCues) {
      // composers
      for (const composer of cue.composers) {
        // reverse composer lookup
        const composerID = getContributorID(composer);
        await client.query(
          `INSERT INTO composers_in_cue (cue, contributor) VALUES ($1, $2)`,
          [cue.id, composerID]
        );
      }
      // orchestrators
      for (const orchestrator of cue.orchestrators) {
        // reverse orchestrator lookup
        const orchestratorID = getContributorID(orchestrator);
        await client.query(
          `INSERT INTO orchestrators_in_cue (cue, contributor) VALUES ($1, $2)`
        );
      }
    }
  });
}
