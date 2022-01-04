import { ILogger } from "@/application/common/interfaces";
import { EOL } from "os";

const pretty = (data: any) => (data ? JSON.stringify(data) : "");
const separate = (left: string, right: string) => `${left} :: ${pretty(right)}`;

const logger: ILogger = (context, data: any, ...rest: any[]) =>
  console.log(
    [
      separate(context, data),
      ...rest.map((x) => separate("".padStart(context.length, " "), x)),
    ].join(EOL)
  );

export { logger };
