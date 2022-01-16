import { IRequest, ICommandHandler, IBehavior } from "@core/cqrs/types";

const GlobalMochaOptions: Mocha.MochaOptions = {
  allowUncaught: false,
  asyncOnly: true,
  forbidPending: true,
  parallel: true,
};

type Outcome = "passes" | "fails";
type TestRequest = IRequest<"testRequest">;

const createPromise = (outcome: Outcome = "passes"): Promise<any> =>
  Promise[outcome === "passes" ? "resolve" : "reject"]();

const createTestRequest = (): TestRequest => ({
  requestName: "testRequest",
});

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
  GlobalMochaOptions,
  Outcome,
  createPromise,
  TestRequest,
  createTestBehavior,
  createTestRequest,
  createTestRequestHandler,
};
