import { Username, Password } from "@backend/domain/common/constrainedTypes";
import { Id } from "@backend/domain/common/id";
import { InferType, object, string } from "yup";

// https://datatracker.ietf.org/doc/html/rfc7519#section-4.1
const JWTPayload = object({ sub: Id });
type JWTPayload = InferType<typeof JWTPayload>;

const TokenDto = object({ token: string().strict().required() });
type TokenDto = InferType<typeof TokenDto>;

const AccountDto = object({ username: Username, password: Password });
type AccountDto = InferType<typeof AccountDto>;

export { AccountDto, JWTPayload, TokenDto };
