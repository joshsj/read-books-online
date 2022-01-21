import { IRequest, IRequestName } from "@core/cqrs/types";
import { ensure } from "@core/utilities";
import { mixed, object, ObjectSchema } from "yup";
import { RBOError } from "../error/rboError";
import { IRequestValidator } from "../interfaces/cqrs";

const Request = <T extends IRequestName>(requestName: T): ObjectSchema<IRequest<T>> =>
  object({
    // TODO reduce assertion from any to T, not compatible with current typing
    requestName: mixed((x): x is any => x === requestName)
      .strict()
      .required(),
  });

type Request<T extends IRequestName> = IRequest<T>;

abstract class BaseRequestValidator<T extends IRequest<any>> implements IRequestValidator<T> {
  abstract requestName: T["requestName"];

  constructor(private readonly schema: ObjectSchema<T>) {}

  async validate(request: unknown) {
    ensure(this.schema.isValidSync(request), new RBOError("validation"));
  }
}

export { Request, BaseRequestValidator };
