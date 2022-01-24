import { PositiveNumber, JWTAlgorithm } from "@backend/domain/common/constrainedTypes";
import { object, string, InferType, array } from "yup";
import { Mode } from "./mode";

const IConfiguration = object({
  mode: Mode,

  hashing: object({ saltRounds: PositiveNumber }),
  mongo: object({ uri: string().strict().required(), databaseName: string().strict().required() }),

  auth: object({
    expiresInMs: PositiveNumber.required(),

    jwt: object({
      secret: string().strict().required(),
      algorithm: JWTAlgorithm.required(),
      issuer: string().strict().required(),
      audience: string().strict().required(),
    }),
  }),

  server: object({
    port: PositiveNumber,
    cors: object({ origins: array().of(string().strict().required()).strict().required().min(1) }),

    cookie: object({
      secret: string().strict().required(),
      refreshTokenKey: string().strict().required(),
    }),
  }),
});

type IConfiguration = InferType<typeof IConfiguration>;

export { IConfiguration };
