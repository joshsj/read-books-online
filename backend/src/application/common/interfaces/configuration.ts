import { PositiveNumber, JWTAlgorithm } from "@/domain/common/constrainedTypes";
import { object, string, InferType } from "yup";
import { Mode } from "./mode";

const IConfiguration = object({
  mode: Mode,

  hashing: object({ saltRounds: PositiveNumber }),
  mongo: object({ uri: string().strict().required(), databaseName: string().strict().required() }),

  auth: object({
    expiresInMs: PositiveNumber,

    jwt: object({
      secret: string().strict().required(),
      algorithm: JWTAlgorithm,
      issuer: string().strict().required(),
      audience: string().strict().required(),
    }),
  }),

  server: object({
    port: PositiveNumber,

    cookie: object({
      secret: string().strict().required(),
      refreshTokenKey: string().strict().required(),
    }),
  }),
});

type IConfiguration = InferType<typeof IConfiguration>;

export { IConfiguration };
