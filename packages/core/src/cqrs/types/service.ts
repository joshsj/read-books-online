import { INotification, INotificationName } from "./notification";
import { IRequest, IRequestName, IResponseReturnValue } from "./request";

type ICQRS = {
  send: <T extends IRequest<IRequestName>>(request: T) => Promise<IResponseReturnValue>;

  publish: <T extends INotification<INotificationName>>(notification: T) => Promise<void>;
};

export { ICQRS };
