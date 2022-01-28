import { IRequest, IRequestName, IResponseReturnValue } from "./request";

type IRequestBehavior = {
  handle: <T extends IResponseReturnValue>(
    request: IRequest<IRequestName>,
    next: () => Promise<T>
  ) => Promise<T>;
};

export { IRequestBehavior };
