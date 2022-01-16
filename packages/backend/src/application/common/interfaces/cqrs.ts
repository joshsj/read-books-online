import { IRequest, IRequestName } from "@core/cqrs/types";

type IRequestValidator<T extends IRequest<IRequestName>> = {
  requestName: T["requestName"];
  validate: (t: T) => Promise<void | never>;
};

type IRequestAuthorizer<T extends IRequest<IRequestName>> = {
  requestName: T["requestName"];
  authorize: (t: T) => Promise<void | never>;
};

export { IRequestAuthorizer, IRequestValidator };
