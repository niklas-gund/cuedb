import { Contributor } from "./Contributor";

export interface Cue {
  id: string | undefined;
  rank: number;
  slate: string;
  title: string;
  composers: Contributor[];
  orchestrators: Contributor[];
}

export function createCue(cue: Partial<Cue> = {}): Cue {
  return {
    id: cue.id,
    rank: cue.rank || 0,
    slate: cue.slate || "",
    title: cue.title || "",
    composers: cue.composers || [],
    orchestrators: cue.orchestrators || [],
  };
}
