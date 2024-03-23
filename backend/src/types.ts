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
