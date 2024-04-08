type StandardResponse = {
  status: "success" | "error";
  error?: string;
  content?: unknown;
};

type CuePermissions = {
  perm_add_movie: boolean;
  perm_submit_set: boolean;
  perm_review_set: boolean;
  perm_user_rights_management: boolean;
  perm_add_contributor: boolean;
};

type UserInfo = {
  username: string;
  permissions: CuePermissions;
};

interface SessionInfo extends UserInfo {
  userID: string;
}

interface FrontendCueSet {
  cueSource: string;
  movieID: string;
  cues: FrontendCue[];
}

interface FrontendCue {
  id: string;
  slate: string;
  title: string;
  composers: string[];
  orchestrators: string[];
}

interface BackendCue extends FrontendCue {
  rank: number;
}
