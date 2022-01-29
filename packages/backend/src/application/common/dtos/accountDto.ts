import { InferType, object, string } from "yup";

const AccountDto = object({ username: string().required(), password: string().required() });
type AccountDto = InferType<typeof AccountDto>;

export { AccountDto };
