import { JWTAlgorithm, PositiveNumber } from "@/domain/common/constrainedTypes";
import { Record, Static, String } from "runtypes";
import { Mode } from "./mode";

const IConfiguration = Record({
  hashing: Record({ saltRounds: PositiveNumber }),
  mode: Mode,
  jwt: Record({
    secret: String,
    expiresIn: String,
    algorithm: JWTAlgorithm,
  }),
});

type IConfiguration = Static<typeof IConfiguration>;

export { IConfiguration };
