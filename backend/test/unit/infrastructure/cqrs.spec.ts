import { IBehavior, IRequestHandler } from "@/application/common/interfaces/cqrs";
import { CQRS } from "@/infrastructure/cqrs";
import { Dependency } from "@/application/dependency";
import {
  createTestBehavior,
  createTestRequestHandler,
  createTestRequest,
} from "@/test/unit/utilities/mocks";
import { expect } from "chai";
import { spy } from "sinon";
import { container } from "tsyringe";

describe("CQRS", () => {
  beforeEach(() => container.clearInstances());

  describe("Dependencies", () => {
    it("Defaults without a constructor value", async () => {
      const handler = createTestRequestHandler();
      const handlerSut = spy(handler, "handle");

      container.register<IRequestHandler>(Dependency.requestHandler, {
        useValue: handler,
      });

      await new CQRS(undefined).send(createTestRequest());

      expect(handlerSut.called).to.be.true;
    });

    it("Uses the constructor container when provided", async () => {
      const handler = createTestRequestHandler();
      const handlerSut = spy(handler, "handle");

      const childContainer = container.createChildContainer();
      childContainer.register<IRequestHandler>(Dependency.requestHandler, {
        useValue: handler,
      });

      await new CQRS(childContainer).send(createTestRequest());

      expect(handlerSut.called).to.be.true;
    });
  });

  describe("Handlers", () => {
    it("Invokes the request handler", async () => {
      const handler = createTestRequestHandler();
      const handlerSpy = spy(handler, "handle");
      container.register<IRequestHandler>(Dependency.requestHandler, {
        useValue: handler,
      });

      await new CQRS().send(createTestRequest());

      expect(handlerSpy.called).to.be.true;
    });

    it("Throws when no handler is provided", () => {
      const result = new CQRS().send(createTestRequest());

      return expect(result).to.be.rejectedWith(Error);
    });

    it("Throws when multiple handlers are provided", () => {
      container
        .register<IRequestHandler>(Dependency.requestHandler, {
          useValue: createTestRequestHandler(),
        })
        .register<IRequestHandler>(Dependency.requestHandler, {
          useValue: createTestRequestHandler(),
        });

      const result = new CQRS().send(createTestRequest());

      return expect(result).to.be.rejectedWith(Error);
    });
  });

  describe("Behaviors", () => {
    it("Invokes behaviors in-order", async () => {
      const behavior1 = createTestBehavior("passes");
      const behavior2 = createTestBehavior("passes");
      const handler = createTestRequestHandler();

      container
        .register<IBehavior>(Dependency.requestBehavior, {
          useValue: behavior1,
        })
        .register<IBehavior>(Dependency.requestBehavior, {
          useValue: behavior2,
        })
        .register<IRequestHandler>(Dependency.requestHandler, {
          useValue: handler,
        });

      const behavior1Spy = spy(behavior1, "handle");
      const behavior2Spy = spy(behavior2, "handle");
      const handlerSpy = spy(handler, "handle");

      await new CQRS().send(createTestRequest());

      expect(behavior1Spy.called).to.be.true;
      expect(behavior2Spy.called).to.be.true;
      expect(handlerSpy.called).to.be.true;

      expect(behavior2Spy.calledImmediatelyAfter(behavior1Spy)).to.be.true;
      expect(handlerSpy.calledImmediatelyAfter(behavior2Spy)).to.be.true;
    });
  });
});
