import { IRequest, IRequestName } from "@core/cqrs/types";

type IRequestValidator<T extends IRequest<IRequestName>> = {
  requestName: T["requestName"];
  validate: (request: unknown) => Promise<void | never>;
};

type IRequestAuthorizer<T extends IRequest<IRequestName>> = {
  requestName: T["requestName"];
  authorize: (request: T) => Promise<void | never>;
};

export { IRequestAuthorizer, IRequestValidator };
