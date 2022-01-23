import { Username, Password } from "@backend/domain/common/constrainedTypes";
import { object, InferType } from "yup";

const AccountDto = object({ username: Username, password: Password });
type AccountDto = InferType<typeof AccountDto>;

export { AccountDto };
