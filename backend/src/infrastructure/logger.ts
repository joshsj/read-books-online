import { ILogger } from "@/application/common/interfaces/logger";
import { EOL } from "os";

const pretty = (data: any) => (data ? (typeof data === "object" ? JSON.stringify(data) : data) : "");
const separate = (left: string, right: any) => `[${left}] | ${right}`;

const logger: ILogger = (context, data: any, ...rest: any[]) =>
  console.log(
    [
      separate(context, pretty(data)),
      ...rest.map((x) => separate("".padStart(context.length + 2, " "), pretty(x))),
    ].join(EOL)
  );

export { logger };
