export interface Cue {
  id: string | undefined;
  rank: number;
  slate: string;
  title: string;
  composers: string[];
  orchestrators: string[];
}

export function createCue(cue: Partial<Cue> = {}): Cue {
  return {
    id: cue.id || crypto.randomUUID(),
    rank: cue.rank || 0,
    slate: cue.slate || "",
    title: cue.title || "",
    composers: cue.composers || [],
    orchestrators: cue.orchestrators || [],
  };
}
