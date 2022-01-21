import { IHttpContextService } from "@backend/application/common/interfaces/httpContextService";
import { ILogger, ILoggerContext } from "@backend/application/common/interfaces/logger";
import { EOL } from "os";

const bracket = (s: string) => `[${s}]`;
const pretty = (data: any) =>
  data ? (typeof data === "object" ? JSON.stringify(data) : data) : "";

class Logger implements ILogger {
  constructor(private readonly httpContextService?: IHttpContextService) {}

  log(context: ILoggerContext, data: any, ...rest: any[]) {
    const header =
      bracket(context) +
      (this.httpContextService
        ? ` ${bracket("id:" + this.httpContextService.getCurrent().id.toString())}`
        : "");

    rest.unshift(data);
    rest.unshift(header);

    console.log(rest.map(pretty).join(EOL) + EOL);
  }
}

export { Logger };
