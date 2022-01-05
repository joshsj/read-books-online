import {
  IBehavior,
  ICommandHandler,
  IRequest,
  IRequestAuthorizer,
  IRequestValidator,
} from "@/application/common/interfaces/cqrs";
import { ILogger } from "@/application/common/interfaces/logger";
import { ITokenService } from "@/application/common/interfaces/tokenService";

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

const createTestAuthorizer = (outcome: Outcome): IRequestAuthorizer<TestRequest> => ({
  requestName: "testRequest",
  authorize: async () => {
    if (outcome === "fails") {
      throw new Error();
    }
  },
});

const createTestValidator = (outcome: Outcome): IRequestValidator<TestRequest> => ({
  requestName: "testRequest",
  validate: async () => {
    if (outcome === "fails") {
      throw new Error();
    }
  },
});

const createLogger = (): ILogger => () => void 0;

const createTokenService = (outcome?: { create?: Outcome; validate?: Outcome; payload?: Outcome }): ITokenService => ({
  create: () => createPromise(outcome?.create),
  validate: () => createPromise(outcome?.validate),
  payload: () => createPromise(outcome?.payload),
});

const createAuthorizationHeader = (token: string) => "Bearer " + token;

export {
  Outcome,
  TestRequest,
  createTestRequest,
  createTestBehavior,
  createTestRequestHandler,
  createTestAuthorizer,
  createTestValidator,
  createLogger,
  createTokenService,
  createAuthorizationHeader,
};
