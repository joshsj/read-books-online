import { IConfiguration } from "@/application/common/interfaces/configuration";
import {
  IBehavior,
  ICommandHandler,
  IRequest,
  IRequestAuthorizer,
  IRequestValidator,
} from "@/application/common/interfaces/cqrs";
import { ILogger } from "@/application/common/interfaces/logger";

type Outcome = "passes" | "fails";

const createPromise = (outcome: Outcome = "passes"): Promise<any> =>
  Promise[outcome === "passes" ? "resolve" : "reject"]();

const createConfiguration = (): IConfiguration => ({
  mode: "development",

  auth: {
    expiresInMs: 60_000,

    jwt: {
      algorithm: "HS256",
      audience: "audience",
      secret: "secret",
      issuer: "issuer",
    },
  },

  server: {
    port: 1,
    cookie: {
      secret: "secret",
      refreshTokenKey: "refreshTokenKey",
    },
  },

  hashing: {
    saltRounds: 1,
  },

  mongo: {
    uri: "uri",
    databaseName: "databaseName",
  },
});

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

const createLogger = (): ILogger => ({ log: () => void 0 });

const createAuthorizationHeader = (token: string) => "Bearer " + token;

export {
  Outcome,
  TestRequest,
  createPromise,
  createTestRequest,
  createTestBehavior,
  createTestRequestHandler,
  createTestAuthorizer,
  createTestValidator,
  createLogger,
  createAuthorizationHeader,
  createConfiguration,
};
