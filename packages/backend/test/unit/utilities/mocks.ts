import { IConfiguration } from "@backend/application/common/interfaces/configuration";
import { IRequestAuthorizer, IRequestValidator } from "@backend/application/common/interfaces/cqrs";
import { ILogger } from "@backend/application/common/interfaces/logger";
import { Outcome, TestRequest } from "@core/test/utilities/mocks";

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

const createLogger = (): ILogger => ({ log: () => void 0 });

const createAuthorizationHeader = (token: string) => "Bearer " + token;

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

export {
  createLogger,
  createAuthorizationHeader,
  createConfiguration,
  createTestAuthorizer,
  createTestValidator,
};
