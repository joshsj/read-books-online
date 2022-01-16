import { IHttpContextService } from "@/application/common/interfaces/httpContextService";
import { ILogger, ILoggerContext } from "@/application/common/interfaces/logger";
import { EOL } from "os";

const bracket = (s: string) => `[${s}]`;
const pretty = (data: any) =>
  data ? (typeof data === "object" ? JSON.stringify(data) : data) : "";
const separate = (left: string, right: any) => `${left} | ${right}`;

class Logger implements ILogger {
  constructor(private readonly httpContextService?: IHttpContextService) {}

  log(context: ILoggerContext, data: any, ...rest: any[]) {
    const fullContext =
      bracket(context) +
      (this.httpContextService
        ? ` ${bracket("id:" + this.httpContextService.getCurrent().id.toString())}`
        : "");

    const message =
      separate(fullContext, pretty(data)) +
      (rest.length
        ? EOL + rest.map((x) => separate("".padStart(fullContext.length, " "), pretty(x))).join(EOL)
        : "");

    console.log(message);
  }
}

export { Logger };
