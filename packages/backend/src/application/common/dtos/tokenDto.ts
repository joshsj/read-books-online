import { InferType, object, string } from "yup";

const TokenDto = object({ token: string().strict().required() });
type TokenDto = InferType<typeof TokenDto>;

export { TokenDto };
