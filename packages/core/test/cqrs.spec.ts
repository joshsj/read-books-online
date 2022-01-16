import { CQRS } from "@core/cqrs";
import { expect } from "chai";
import { spy } from "sinon";
import {
  createTestRequestHandler,
  createTestRequest,
  createTestBehavior,
} from "@core/test/utilities/mocks";

describe("CQRS", () => {
  describe("Handlers", () => {
    it("Invokes the request handler", async () => {
      const handler = createTestRequestHandler();
      const handlerSpy = spy(handler, "handle");

      await new CQRS([handler], []).send(createTestRequest());

      expect(handlerSpy.called).to.be.true;
    });

    it("Throws when no handler is provided", () => {
      const result = new CQRS([], []).send(createTestRequest());

      return expect(result).to.be.rejectedWith(Error);
    });

    it("Throws when multiple handlers are provided", () => {
      const handlers = [createTestRequestHandler(), createTestRequestHandler()];

      const result = new CQRS(handlers, []).send(createTestRequest());

      return expect(result).to.be.rejectedWith(Error);
    });
  });

  describe("Behaviors", () => {
    it("Invokes behaviors in-order", async () => {
      const behavior1 = createTestBehavior("passes");
      const behavior2 = createTestBehavior("passes");
      const handler = createTestRequestHandler();

      const behavior1Spy = spy(behavior1, "handle");
      const behavior2Spy = spy(behavior2, "handle");
      const handlerSpy = spy(handler, "handle");

      await new CQRS([handler], [behavior1, behavior2]).send(createTestRequest());

      expect(behavior1Spy.called).to.be.true;
      expect(behavior2Spy.called).to.be.true;
      expect(handlerSpy.called).to.be.true;

      expect(behavior2Spy.calledImmediatelyAfter(behavior1Spy)).to.be.true;
      expect(handlerSpy.calledImmediatelyAfter(behavior2Spy)).to.be.true;
    });
  });
});
