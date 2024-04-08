export interface Cue {
  id: string | undefined;
  slate: string;
  title: string;
  composers: string[];
  orchestrators: string[];
}

export function createCue(cue: Partial<Cue> = {}): Cue {
  return {
    id: cue.id || crypto.randomUUID(),
    slate: cue.slate || "",
    title: cue.title || "",
    composers: cue.composers || [],
    orchestrators: cue.orchestrators || [],
  };
}

export function cloneCue(cue: Cue) {
  return createCue({
    id: cue.id,
    slate: cue.slate,
    title: cue.title,
    composers: [...cue.composers],
    orchestrators: [...cue.orchestrators],
  });
}
