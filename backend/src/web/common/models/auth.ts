import { Username, Password } from "@/domain/common/constrainedTypes";
import { Id } from "@/domain/common/id";
import { Record, Static, String } from "runtypes";

// https://datatracker.ietf.org/doc/html/rfc7519#section-4.1
const JWTPayload = Record({ sub: Id });
type JWTPayload = Static<typeof JWTPayload>;

const TokenDto = Record({ token: String });
type TokenDto = Static<typeof TokenDto>;

const AccountDto = Record({ username: Username, password: Password });
type AccountDto = Static<typeof AccountDto>;

export { AccountDto, JWTPayload, TokenDto };
