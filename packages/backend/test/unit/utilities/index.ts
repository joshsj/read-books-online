import { RBOError } from "@backend/application/common/error/rboError";
import { IConfiguration } from "@backend/application/common/interfaces/configuration";
import { IRequestAuthorizer, IRequestValidator } from "@backend/application/common/interfaces/cqrs";
import { ILogger } from "@backend/application/common/interfaces/logger";
import { Outcome, TestRequest } from "@core/utilities/test";

type ExpectedError = Pick<RBOError, "type"> & Pick<Partial<RBOError>, "message">;

const createConfiguration = (): IConfiguration => ({
  mode: "development",
  appUrl: "appUrl",

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
    https: {
      keyPath: ".",
      certPath: ".",
    },
  },

  email: {
    host: "email.host",
    port: 1,
    from: "from",
  },

  hashing: {
    saltRounds: 1,
  },

  mongo: {
    uri: "uri",
    databaseName: "databaseName",
  },

  ticket: { costThreshold: 1 },
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
  ExpectedError,
  createConfiguration,
  createLogger,
  createAuthorizationHeader,
  createTestAuthorizer,
  createTestValidator,
};
