import {
  IBehavior,
  ICQRS,
  IRequestHandler,
  IRequest,
  IRequestName,
  IResponseReturnValue,
} from "@core/cqrs/types";
import { ensure } from "@core/utilities";

class CQRS implements ICQRS {
  constructor(
    private readonly handlers: IRequestHandler[],
    private readonly behaviors: IBehavior[]
  ) {}

  async send<T extends IRequest<IRequestName>>(request: T) {
    const handlers = this.handlers.filter((h) => h.handles === request.requestName);

    ensure(
      handlers.length === 1,
      handlers.length > 1
        ? new Error(`Multiple handlers registered for request ${request.requestName}`)
        : new Error(`No handler found for ${request.requestName}`)
    );

    const handler = handlers[0]!;

    if (!this.behaviors.length) {
      return await handler.handle(request);
    }

    let behaviorCounter = 0;

    const next = async (): Promise<IResponseReturnValue> => {
      ++behaviorCounter;

      return await (behaviorCounter < this.behaviors.length
        ? this.behaviors[behaviorCounter]!.handle(request, next)
        : handler.handle(request));
    };

    return await this.behaviors[0]!.handle(request, next);
  }
}

export { CQRS };
