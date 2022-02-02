import { User } from "@backend/domain/entities/user";

type UserDto = Pick<User, "_id" | "username" | "email" | "roles" | "disabled">;

const UserDto = {
  fromUser: ({ _id, email, username, roles, disabled }: User): UserDto => ({
    _id,
    email,
    username,
    roles,
    disabled,
  }),
};

export { UserDto };
