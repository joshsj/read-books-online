import { guard } from "@/common/utilities";
import { Dependency, ILogger } from "@/dependency";
import { container } from "tsyringe";
import {
  IHandler,
  IBehavior,
  ICQRSManager,
  IRequest,
  IResponseReturnValue,
  IRequestName,
} from "@/common/cqrs";

const _send = async <T extends IRequest<IRequestName>>(
  request: T
): Promise<IResponseReturnValue> => {
  const log = container.resolve<ILogger>(Dependency.logger);
  const handlers = container
    .resolveAll<IHandler>(Dependency.handler)
    .filter((h) => h.handles === request.requestName);

  if (!handlers.length) {
    log("cqrs", `No handler found for ${request.requestName}`);
    return;
  }

  guard(
    handlers.length > 1,
    `Multiple handlers registered for request ${request.requestName}`
  );

  const handler = handlers[0]!;

  const behaviors = container.isRegistered(Dependency.behavior)
    ? container.resolveAll<IBehavior>(Dependency.behavior)
    : [];

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

const createCQRSManager = (): ICQRSManager => ({
  sender: { send: (request) => _send(request) },
});

export { createCQRSManager };
