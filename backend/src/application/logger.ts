import { ILogger } from "@/dependency";

const logger: ILogger = (context, data: any, ...rest: any[]) =>
  console.log(
    `[${context}] ${[data, ...rest]
      .map((x) => (typeof x === "object" ? JSON.stringify(x) : x))
      .join(", ")}`
  );

export { logger };
