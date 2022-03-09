import { JWTAlgorithm, PositiveNumber } from "@backend/domain/common/constrainedTypes";
import { InferType, object, string } from "yup";
import { Mode } from "./mode";

const IConfiguration = object({
  mode: Mode,

  hashing: object({ saltRounds: PositiveNumber }),

  mongo: object({ uri: string().strict().required(), databaseName: string().strict().required() }),

  auth: object({
    expiresInMs: PositiveNumber.required(),

    jwt: object({
      secret: string().strict().required(),
      algorithm: JWTAlgorithm,
      issuer: string().strict().required(),
      audience: string().strict().required(),
    }),
  }),

  server: object({
    port: PositiveNumber,

    https: object({
      certPath: string().strict().required(),
      keyPath: string().strict().required(),
    }),
  }),

  email: object({
    host: string().required(),
    port: PositiveNumber.required(),
    from: string().required(),
  }),

  ticket: object({ costThreshold: PositiveNumber.required() }),

  appUrl: string().required(),
});

type IConfiguration = InferType<typeof IConfiguration>;

export { IConfiguration };
