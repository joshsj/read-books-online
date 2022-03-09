import { IHttpContextService } from "@backend/application/common/interfaces/httpContextService";
import { ILogger, ILoggerContext } from "@backend/application/common/interfaces/logger";
import { EOL } from "os";

const bracket = (s: string) => `[${s}]`;
const pretty = (data: any): string =>
  data ? (typeof data === "object" ? JSON.stringify(data) : data) : "";

class Logger implements ILogger {
  constructor(private readonly httpContextService?: IHttpContextService) {}

  log(context: ILoggerContext, data: any, ...rest: any[]) {
    const headers: string[] = [context];

    if (this.httpContextService) {
      const { id, type } = this.httpContextService.getCurrent();

      headers.push(type);
      headers.push(`ID: ${id}`);
    }

    rest.unshift(data);
    rest.unshift(headers.map(bracket).join(" "));

    console.log(rest.map(pretty).join(EOL) + EOL);
  }
}

export { Logger };
