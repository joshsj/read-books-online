import { Password, Username } from "@/domain/common/constrainedTypes";
import { Record, Static } from "runtypes";

const AccountDto = Record({ username: Username, password: Password });
type AccountDto = Static<typeof AccountDto>;

export { AccountDto };
