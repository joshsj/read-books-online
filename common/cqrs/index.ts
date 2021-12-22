import {
  IBehavior,
  ICQRS,
  IHandler,
  IRequest,
  IRequestName,
  IResponseReturnValue,
} from "./types";

const send = async <T extends IRequest<IRequestName>>(
  handlers: IHandler[],
  behaviors: IBehavior[],
  request: T
): Promise<IResponseReturnValue> => {
  handlers = handlers.filter((h) => h.handles === request.requestName);

  if (handlers.length === 0) {
    throw new Error(`No handler found for ${request.requestName}`);
  }

  if (handlers.length > 1) {
    throw new Error(
      `Multiple handlers registered for request ${request.requestName}`
    );
  }

  const handler = handlers[0]!;

  if (!behaviors.length) {
    return await handler.handle(request);
  }

  let behaviorCounter = 0;

  const next = async (): Promise<IResponseReturnValue> => {
    ++behaviorCounter;

    return await (behaviorCounter < behaviors.length
      ? behaviors[behaviorCounter]!.handle(request, next)
      : handler.handle(request));
  };

  return await behaviors[0]!.handle(request, next);
};

const createCQRS = (handlers: IHandler[], behaviors: IBehavior[]): ICQRS => ({
  send: (request) => send(handlers, behaviors, request),
});

export { createCQRS };
