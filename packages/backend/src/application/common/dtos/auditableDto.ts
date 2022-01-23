import { UserDto } from "./userDto";

type AuditableDto<T extends string> = {
  [K in T]: {
    at: Date;
    by: UserDto;
  };
};

export { AuditableDto };
