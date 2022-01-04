import {
  IBehavior,
  ICQRS,
  IRequestHandler,
  IRequest,
  IRequestName,
  IResponseReturnValue,
} from "@/application/common/interfaces/cqrs";
import { Dependency } from "@/infrastructure/dependency";
import { container as defaultContainer, DependencyContainer } from "tsyringe";

class CQRS implements ICQRS {
  private readonly container: DependencyContainer;

  constructor(container?: DependencyContainer) {
    this.container = container ?? defaultContainer;
  }

  async send<T extends IRequest<IRequestName>>(request: T) {
    const handlers = this.container
      .resolveAll<IRequestHandler>(Dependency.requestHandler)
      .filter((h) => h.handles === request.requestName);

    if (handlers.length === 0) {
      throw new Error(`No handler found for ${request.requestName}`);
    }

    if (handlers.length > 1) {
      throw new Error(`Multiple handlers registered for request ${request.requestName}`);
    }

    const handler = handlers[0]!;

    const behaviors = this.container.isRegistered(Dependency.requestBehavior)
      ? this.container.resolveAll<IBehavior>(Dependency.requestBehavior)
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
  }
}

export { CQRS };
