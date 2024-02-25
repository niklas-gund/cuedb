import { Request } from "express";

export class StandardResponseWriter {
  public static success(responseObject: unknown): StandardResponse {
    return { status: "success", content: responseObject };
  }
  public static error(errorString: string): StandardResponse {
    return { status: "error", error: errorString };
  }
}

export function parseQuery<T extends string>(
  req: Request,
  args: T[]
): Record<T, string> {
  const parsedStrings = {} as Record<T, string>;
  for (const param of args) {
    const parsed = req.query[param]?.toString();
    if (parsed == undefined) throw new Error(`Missing parameter: ${param}`);
    else parsedStrings[param] = parsed;
  }
  return parsedStrings;
}
