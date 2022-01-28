import { IRequestAuthorizer } from "@backend/application/common/interfaces/cqrs";
import { ILogger } from "@backend/application/common/interfaces/logger";
import { IRequestBehavior } from "@core/cqrs/types/behavior";
import { IRequest, IRequestName, IResponseReturnValue } from "@core/cqrs/types/request";

class AuthorizerBehavior implements IRequestBehavior {
  constructor(
    private readonly logger: ILogger,
    private readonly requestAuthorizers: IRequestAuthorizer<any>[]
  ) {}

  async handle<T extends IResponseReturnValue>(
    request: IRequest<IRequestName>,
    next: () => Promise<T>
  ) {
    const authorizers = this.requestAuthorizers.filter(
      (x) => x.requestName === request.requestName
    );

    if (!authorizers.length) {
      this.logger.log("authorization", `No authorizers found for request ${request.requestName}`);
      return await next();
    }

    this.logger.log(
      "authorization",
      `Resolved ${authorizers.length} authorizers for request ${request.requestName}`
    );

    for (const authorizer of authorizers) {
      await authorizer.authorize(request);
    }

    this.logger.log("authorization", `Passed for request ${request.requestName}`);

    return await next();
  }
}

export { AuthorizerBehavior };
