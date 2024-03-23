import { MovieSearchResult } from "../APIConnector";

export interface CueSet {
  id?: string;
  title: string;
  cueSource: string;
  movie?: MovieSearchResult;
}

export function emptyCueset(): CueSet {
  return {
    title: "",
    cueSource: "",
  };
}
