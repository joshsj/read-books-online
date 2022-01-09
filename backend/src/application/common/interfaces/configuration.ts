import { JWTAlgorithm, PositiveNumber } from "@/domain/common/constrainedTypes";
import { Record, Static, String } from "runtypes";
import { Mode } from "./mode";

const IConfiguration = Record({
  mode: Mode,
  hashing: Record({ saltRounds: PositiveNumber }),
  mongo: Record({ uri: String, databaseName: String }),

  auth: Record({
    expiresInMs: PositiveNumber,

    jwt: Record({
      secret: String,
      algorithm: JWTAlgorithm,
      issuer: String,
      audience: String,
    }),
  }),

  server: Record({
    port: PositiveNumber,

    cookie: Record({
      secret: String,
      refreshTokenKey: String,
    }),
  }),
});

type IConfiguration = Static<typeof IConfiguration>;

export { IConfiguration };
