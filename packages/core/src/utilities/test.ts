import { IRequestBehavior } from "@core/cqrs/types/behavior";
import { INotification, INotificationHandler } from "@core/cqrs/types/notification";
import { ICommandHandler, IRequest } from "@core/cqrs/types/request";

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

const createTestBehavior = (outcome: Outcome): IRequestBehavior => ({
  handle: async ({}, next) => {
    if (outcome === "fails") {
      throw new Error();
    }

    return await next();
  },
});

type TestNotification = INotification<"testNotification">;

const createTestNotification = (): TestNotification => ({
  notificationName: "testNotification",
});

const createTestNotificationHandler = (): INotificationHandler<TestNotification> => ({
  handles: "testNotification",
  handle: async () => {},
});

export {
  GlobalMochaOptions,
  Outcome,
  createPromise,
  TestRequest,
  createTestBehavior,
  createTestRequest,
  createTestRequestHandler,
  createTestNotification,
  createTestNotificationHandler,
};
