import { ILogger } from "@/application/common/interfaces/logger";
import { EOL } from "os";

const pretty = (data: any) => (data ? JSON.stringify(data) : "");
const separate = (left: string, right: any) => `${left} :: ${pretty(right)}`;

const logger: ILogger = (context, data: any, ...rest: any[]) =>
  console.log(
    [
      separate(context, data),
      ...rest.map((x) => separate("".padStart(context.length, " "), x)),
    ].join(EOL)
  );

export { logger };
