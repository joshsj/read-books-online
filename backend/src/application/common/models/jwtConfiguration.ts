import { Algorithm } from "jsonwebtoken";
import { Record, Static, String } from "runtypes";

const JWTConfiguration = Record({
  secret: String,
  expiresIn: String,
  algorithm: String.withConstraint<Algorithm>((x) => x),
});

type JWTConfiguration = Static<typeof JWTConfiguration>;

export { JWTConfiguration };
