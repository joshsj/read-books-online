import {
  IBehavior,
  ICQRS,
  IHandler,
  IRequest,
  IRequestName,
  IResponseReturnValue,
} from "../application/common/interfaces/cqrs";

class CQRS implements ICQRS {
  constructor(
    private readonly handlers: IHandler[],
    private readonly behaviors: IBehavior[]
  ) {}

  send = async <T extends IRequest<IRequestName>>(request: T) => {
    const handlers = this.handlers.filter(
      (h) => h.handles === request.requestName
    );

    if (handlers.length === 0) {
      throw new Error(`No handler found for ${request.requestName}`);
    }

    if (handlers.length > 1) {
      throw new Error(
        `Multiple handlers registered for request ${request.requestName}`
      );
    }

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
  };
}

export { CQRS };
