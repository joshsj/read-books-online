import { JWTPayload } from "@/web/common/models/auth";

type Token = string;

type ITokenService = {
  create(payload: JWTPayload): Promise<Token>;
  validate(token: Token): Promise<JWTPayload>;

  /** Warning: does not validate the token before returning the payload */
  payload(token: Token): Promise<JWTPayload>;
};

export { Token, ITokenService };
