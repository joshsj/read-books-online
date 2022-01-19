import { IRequestValidator } from "@backend/application/common/interfaces/cqrs";
import { ILogger } from "@backend/application/common/interfaces/logger";
import { IBehavior, IRequest, IRequestName, IResponseReturnValue } from "@core/cqrs/types";

class ValidatorBehavior implements IBehavior {
  constructor(
    private readonly logger: ILogger,
    private readonly requestValidators: IRequestValidator<any>[]
  ) {}

  async handle<T extends IResponseReturnValue>(
    request: IRequest<IRequestName>,
    next: () => Promise<T>
  ) {
    const validators = this.requestValidators.filter((v) => v.requestName === request.requestName);

    if (!validators.length) {
      this.logger.log(
        "cqrs",
        `Skipping validation for request ${request.requestName}, no validators were resolved`
      );
      return await next();
    }

    this.logger.log(
      "cqrs",
      `Resolved ${validators.length} validators for request ${request.requestName}`
    );

    for (const validator of validators) {
      await validator.validate(request);
    }

    this.logger.log("cqrs", `Validation passed for request ${request.requestName}`);

    return await next();
  }
}

export { ValidatorBehavior };
