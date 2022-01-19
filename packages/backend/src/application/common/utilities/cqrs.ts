import { IRequest, IRequestName } from "@core/cqrs/types";
import { mixed, object, ObjectSchema } from "yup";

const Request = <T extends IRequestName>(requestName: T): ObjectSchema<IRequest<T>> =>
  object({
    // TODO reduce assertion from any to T, not compatible with current typing
    requestName: mixed((x): x is any => x === requestName)
      .strict()
      .required(),
  });

export { Request };
