export default class APIConnector {
  private static async callAPI<T>(url: string, queryParams: URLSearchParams) {
    const res = await (await await fetch(url + "?" + queryParams)).json();
    if (res.status !== "success") {
      if (res.error === "Error: Not Authenticated") {
        window.location.href = "/login";
      }
      console.error(res.error);
    }

    return res as StandardResponse<T>;
  }

  public static async signup(options: { username: string; password: string }) {
    return APIConnector.callAPI<boolean>(
      "/api/signup",
      new URLSearchParams(options)
    );
  }

  public static async login(options: { username: string; password: string }) {
    return APIConnector.callAPI<UserInfo>(
      "/api/login",
      new URLSearchParams(options)
    );
  }

  public static async searchMovie(options: { query: string }) {
    return APIConnector.callAPI<TMDBPagination<MovieSearchResult>>(
      "/api/movies/search",
      new URLSearchParams(options)
    );
  }

  public static async addMovie(options: { tmdbID: string; title: string }) {
    return APIConnector.callAPI<boolean>(
      "/api/movies/add",
      new URLSearchParams(options)
    );
  }

  public static async searchContributor(options: { query: string }) {
    return APIConnector.callAPI<TMDBPagination<PersonSearchResult>>(
      "/api/people/search",
      new URLSearchParams(options)
    );
  }

  public static async addContributor(options: {
    tmdbID: string;
    name: string;
  }) {
    return APIConnector.callAPI<boolean>(
      "/api/people/add",
      new URLSearchParams(options)
    );
  }

  public static async searchLocalMovies(options: { query: string }) {
    return APIConnector.callAPI<MovieSearchResult[]>(
      "/api/movies/search-local",
      new URLSearchParams(options)
    );
  }
}

export type CuePermissions = {
  perm_add_movie: boolean;
  perm_submit_set: boolean;
  perm_review_set: boolean;
  perm_user_rights_management: boolean;
  perm_add_contributor: boolean;
};

export type UserInfo = {
  username: string;
  permissions: CuePermissions;
};

export type TMDBPagination<T> = {
  page: number;
  total_pages: number;
  total_results: number;
  results: T[];
};

export type MovieSearchResult = {
  title: string;
  poster_path: string;
  id: number;
  overview: string;
  release_date: string;
};

export type PersonSearchResult = {
  name: string;
  id: number;
  profile_path: string;
  known_for_department: string;
  known_for: MovieSearchResult[];
};

export type StandardResponse<T> =
  | StandardResponseError<T>
  | StandardResponseSuccess<T>;

type StandardResponseError<T> = {
  status: "error";
  error: string;
  content?: T;
};

type StandardResponseSuccess<T> = {
  status: "success";
  content: T;
};
