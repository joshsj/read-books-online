import { Username, Password } from "@backend/domain/common/constrainedTypes";
import { object, InferType } from "yup";

const AccountDto = object({ username: Username.required(), password: Password.required() });
type AccountDto = InferType<typeof AccountDto>;

export { AccountDto };
