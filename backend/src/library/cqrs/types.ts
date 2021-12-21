type IRequestName = `${string}Request`;
type IRequest<T extends IRequestName> = { requestName: T };
type IResponseReturnValue = object | void;

type IBaseHandler<T extends IRequest<IRequestName>> = {
  handles: T["requestName"];
};

type IQueryHandler<
  TRequest extends IRequest<IRequestName>,
  TResponse extends object
> = IBaseHandler<TRequest> & {
  handle: (request: TRequest) => Promise<TResponse>;
};

type ICommandHandler<TRequest extends IRequest<IRequestName>> =
  IBaseHandler<TRequest> & {
    handle: (request: TRequest) => Promise<void>;
  };

type IHandler = IQueryHandler<any, any> | ICommandHandler<any>;

type IBehavior = {
  handle: <T extends IResponseReturnValue>(
    request: IRequest<IRequestName>,
    next: () => Promise<T>
  ) => Promise<T>;
};

type IRequestSender = {
  send: <T extends IRequest<IRequestName>>(
    request: T
  ) => Promise<IResponseReturnValue>;
};

type ICQRSManager = {
  sender: IRequestSender;
};

export {
  IRequestName,
  IResponseReturnValue,
  IRequest,
  IBaseHandler,
  IQueryHandler,
  ICommandHandler,
  IBehavior,
  IRequestSender,
  ICQRSManager,
  IHandler,
};
