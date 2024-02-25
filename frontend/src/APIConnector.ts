export default class APIConnector {
  public static async signup(options: { username: string; password: string }) {
    const res = await (
      await fetch("/api/signup?" + new URLSearchParams(options))
    ).json();
    return res as StandardResponse<boolean>;
  }

  public static async login(options: { username: string; password: string }) {
    const res = await (
      await fetch("/api/login?" + new URLSearchParams(options))
    ).json();
    return res as StandardResponse<boolean>;
  }
}

export type StandardResponse<T> = {
  status: "success" | "error";
  error?: string;
  content?: T;
};
