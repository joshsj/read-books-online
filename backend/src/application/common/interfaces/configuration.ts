import { JWTAlgorithm, PositiveNumber } from "@/domain/common/constrainedTypes";
import { Number, Record, Static, String } from "runtypes";
import { Mode } from "./mode";

const IConfiguration = Record({
  mode: Mode,

  server: Record({
    port: Number,
  }),

  hashing: Record({
    saltRounds: PositiveNumber,
  }),

  mongo: Record({
    uri: String,
    databaseName: String,
  }),

  jwt: Record({
    secret: String,
    expiresIn: String,
    algorithm: JWTAlgorithm,
    issuer: String,
    audience: String,
  }),
});

type IConfiguration = Static<typeof IConfiguration>;

export { IConfiguration };
