import { ILogger } from "@backend/application/common/interfaces/logger";
import { IRequestBehavior } from "@core/cqrs/types/behavior";
import { IRequest, IRequestName, IResponseReturnValue } from "@core/cqrs/types/request";

class RequestLoggerBehavior implements IRequestBehavior {
  constructor(private readonly logger: ILogger) {}

  async handle<T extends IResponseReturnValue>(
    request: IRequest<IRequestName>,
    next: () => Promise<T>
  ) {
    this.logger.log("cqrs", `Received request`, request);

    const result = await next();

    this.logger.log("cqrs", `Responding to ${request.requestName}`, result);

    return result;
  }
}

export { RequestLoggerBehavior };
