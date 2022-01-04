import {
  IBehavior,
  ICommandHandler,
  IRequest,
  IRequestAuthorizer,
  IRequestValidator,
} from "@/application/common/interfaces/cqrs";
import { ILogger } from "@/application/common/interfaces/logger";

type Outcome = "passes" | "fails";

type TestRequest = IRequest<"testRequest">;
const createTestRequest = (): TestRequest => ({ requestName: "testRequest" });

const createTestHandler = (): ICommandHandler<TestRequest> => ({
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

const createTestAuthorizer = (
  outcome: Outcome
): IRequestAuthorizer<TestRequest> => ({
  requestName: "testRequest",
  authorize: async () => {
    if (outcome === "fails") {
      throw new Error();
    }
  },
});

const createTestValidator = (
  outcome: Outcome
): IRequestValidator<TestRequest> => ({
  requestName: "testRequest",
  validate: async () => {
    if (outcome === "fails") {
      throw new Error();
    }
  },
});

const createLogger = (): ILogger => () => void 0;

export {
  TestRequest,
  createTestRequest,
  createTestBehavior,
  createTestHandler,
  createTestAuthorizer,
  createTestValidator,
  createLogger,
};
