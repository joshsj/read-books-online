import { Id } from "@/domain/common/id";
import { Record, Static } from "runtypes";

// https://datatracker.ietf.org/doc/html/rfc7519#section-4.1
const JWTPayload = Record({ sub: Id });

type JWTPayload = Static<typeof JWTPayload>;

export { JWTPayload };
