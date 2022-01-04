type IRequestName = `${string}Request`;
type IRequest<T extends IRequestName> = { requestName: T };
type IResponseReturnValue = object | void;

type IBaseHandler<T extends IRequest<IRequestName>> = {
  handles: T["requestName"];
};

type IQueryHandler<TRequest extends IRequest<IRequestName>, TResponse extends object> = IBaseHandler<TRequest> & {
  handle: (request: TRequest) => Promise<TResponse>;
};

type ICommandHandler<TRequest extends IRequest<IRequestName>> = IBaseHandler<TRequest> & {
  handle: (request: TRequest) => Promise<void>;
};

type IRequestHandler = IQueryHandler<any, any> | ICommandHandler<any>;

type IBehavior = {
  handle: <T extends IResponseReturnValue>(request: IRequest<IRequestName>, next: () => Promise<T>) => Promise<T>;
};

type ICQRS = {
  send: <T extends IRequest<IRequestName>>(request: T) => Promise<IResponseReturnValue>;
};

type IRequestValidator<T extends IRequest<IRequestName>> = {
  requestName: T["requestName"];
  validate: (t: T) => Promise<void | never>;
};

type IRequestAuthorizer<T extends IRequest<IRequestName>> = {
  requestName: T["requestName"];
  authorize: (t: T) => Promise<void | never>;
};

export {
  IRequestName,
  IResponseReturnValue,
  IRequest,
  IBaseHandler,
  IQueryHandler,
  ICommandHandler,
  IBehavior,
  ICQRS,
  IRequestHandler,
  IRequestValidator,
  IRequestAuthorizer,
};
