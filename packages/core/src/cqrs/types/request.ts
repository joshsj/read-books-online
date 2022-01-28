type IRequestName = `${string}Request`;
type IRequest<T extends IRequestName> = { requestName: T };

type IResponseReturnValue = object | void;

type IBaseRequestHandler<T extends IRequest<IRequestName>> = {
  handles: T["requestName"];
};

type IQueryHandler<
  TRequest extends IRequest<IRequestName>,
  TResponse extends object
> = IBaseRequestHandler<TRequest> & {
  handle: (request: TRequest) => Promise<TResponse>;
};

type ICommandHandler<TRequest extends IRequest<IRequestName>> = IBaseRequestHandler<TRequest> & {
  handle: (request: TRequest) => Promise<void>;
};

type IRequestHandler = IQueryHandler<any, any> | ICommandHandler<any>;

export {
  IRequestName,
  IRequest,
  IQueryHandler,
  ICommandHandler,
  IRequestHandler,
  IResponseReturnValue,
};
