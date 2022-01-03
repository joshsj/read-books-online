import {
  IBehavior,
  ICommandHandler,
  IHandler,
  IRequest,
} from "@/application/common/interfaces/cqrs";
import { CQRS } from "@/infrastructure/cqrs";
import { Dependency } from "@/infrastructure/dependency";
import { expect } from "chai";
import { spy } from "sinon";
import { container } from "tsyringe";

type Request = IRequest<"testRequest">;
const Request: Request = { requestName: "testRequest" };

const createHandler = (): ICommandHandler<Request> => ({
  handles: "testRequest",
  handle: async () => {},
});

const createBehavior = (): IBehavior => ({
  handle: async ({}, next) => next(),
});

describe("CQRS", () => {
  afterEach(() => container.clearInstances());

  describe("Dependencies", () => {
    it("Uses the constructor container when provided", async () => {
      const handler = createHandler();
      const handlerSut = spy(handler, "handle");

      const childContainer = container.createChildContainer();
      childContainer.register<IHandler>(Dependency.handler, {
        useValue: handler,
      });

      await new CQRS(childContainer).send(Request);

      expect(handlerSut.called).to.be.true;
    });

    it("Defaults without a constructor value", async () => {
      const handler = createHandler();
      const handlerSut = spy(handler, "handle");

      container.register<IHandler>(Dependency.handler, { useValue: handler });

      await new CQRS(undefined).send(Request);

      expect(handlerSut.called).to.be.true;
    });
  });

  describe("Handlers", () => {
    it("Invokes the request handler", async () => {
      const handler = createHandler();
      const handlerSpy = spy(handler, "handle");
      container.register<IHandler>(Dependency.handler, { useValue: handler });

      await new CQRS().send(Request);

      expect(handlerSpy.called).to.be.true;
    });

    it("Throws when no handler is provided", () => {
      expect(new CQRS().send(Request)).to.be.rejected;
    });

    it("Throws when multiple handlers are provided", () => {
      container
        .register<IHandler>(Dependency.handler, {
          useValue: createHandler(),
        })
        .register<IHandler>(Dependency.handler, {
          useValue: createHandler(),
        });

      expect(new CQRS().send(Request)).to.be.rejected;
    });
  });

  describe("Behaviors", () => {
    it("Invokes behaviors in-order", async () => {
      const behavior1 = createBehavior();
      const behavior2 = createBehavior();
      const handler = createHandler();

      container
        .register<IBehavior>(Dependency.behavior, { useValue: behavior1 })
        .register<IBehavior>(Dependency.behavior, { useValue: behavior2 })
        .register<IHandler>(Dependency.handler, { useValue: handler });

      const behavior1Spy = spy(behavior1, "handle");
      const behavior2Spy = spy(behavior2, "handle");
      const handlerSpy = spy(handler, "handle");

      await new CQRS().send(Request);

      expect(behavior1Spy.called).to.be.true;
      expect(behavior2Spy.called).to.be.true;
      expect(handlerSpy.called).to.be.true;

      expect(behavior2Spy.calledImmediatelyAfter(behavior1Spy)).to.be.true;
      expect(handlerSpy.calledImmediatelyAfter(behavior2Spy)).to.be.true;
    });
  });
});
