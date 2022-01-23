import { Id } from "@backend/domain/common/id";
import { Role } from "@backend/domain/constants/role";
import { array, InferType, object, string } from "yup";

// https://datatracker.ietf.org/doc/html/rfc7519#section-4.1
// https://www.iana.org/assignments/jwt/jwt.xhtml
const JWTPayloadDto = object({
  sub: Id,
  preferred_username: string().strict().required(),
  roles: array().of(Role).required(),
});
type JWTPayloadDto = InferType<typeof JWTPayloadDto>;

export { JWTPayloadDto };
