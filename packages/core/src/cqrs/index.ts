import { ensure } from "@core/utilities";
import { IRequestBehavior } from "./types/behavior";
import { INotification, INotificationHandler } from "./types/notification";
import { IRequest, IRequestHandler, IRequestName, IResponseReturnValue } from "./types/request";
import { ICQRS } from "./types/service";

class CQRS implements ICQRS {
  constructor(
    private readonly requestHandlers: IRequestHandler[],
    private readonly requestBehaviors: IRequestBehavior[],
    private readonly notificationHandlers: INotificationHandler<any>[]
  ) {}

  async send<T extends IRequest<IRequestName>>(request: T) {
    const handlers = this.requestHandlers.filter((h) => h.handles === request.requestName);

    ensure(
      handlers.length === 1,
      handlers.length > 1
        ? new Error(`Multiple handlers registered for request ${request.requestName}`)
        : new Error(`No handler found for ${request.requestName}`)
    );

    const handler = handlers[0]!;

    if (!this.requestBehaviors.length) {
      return await handler.handle(request);
    }

    let behaviorCounter = 0;

    const next = async (): Promise<IResponseReturnValue> => {
      ++behaviorCounter;

      return await (behaviorCounter < this.requestBehaviors.length
        ? this.requestBehaviors[behaviorCounter]!.handle(request, next)
        : handler.handle(request));
    };

    return await this.requestBehaviors[0]!.handle(request, next);
  }

  async publish<T extends INotification<any>>(notification: T) {
    const handlers = this.notificationHandlers.filter(
      (h) => (h.handles = notification.notificationName)
    );

    for (const handler of handlers) {
      await handler.handle(notification);
    }
  }
}

export { CQRS };
