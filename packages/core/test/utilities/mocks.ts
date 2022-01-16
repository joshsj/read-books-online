import { IRequest, ICommandHandler, IBehavior } from "@core/cqrs/types";

type Outcome = "passes" | "fails";

const createPromise = (outcome: Outcome = "passes"): Promise<any> =>
  Promise[outcome === "passes" ? "resolve" : "reject"]();

type TestRequest = IRequest<"testRequest">;
const createTestRequest = (): TestRequest => ({ requestName: "testRequest" });

const createTestRequestHandler = (): ICommandHandler<TestRequest> => ({
  handles: "testRequest",
  handle: async () => {},
});

const createTestBehavior = (outcome: Outcome): IBehavior => ({
  handle: async ({}, next) => {
    if (outcome === "fails") {
      throw new Error();
    }

    return await next();
  },
});

export {
  Outcome,
  createPromise,
  TestRequest,
  createTestBehavior,
  createTestRequest,
  createTestRequestHandler,
};
