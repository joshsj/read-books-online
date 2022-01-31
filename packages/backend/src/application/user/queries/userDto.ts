import { User } from "@backend/domain/entities/user";

type UserDto = Pick<User, "_id" | "username" | "email" | "roles">;

const UserDto = {
  fromUser: ({ _id, email, username, roles }: User): UserDto => ({ _id, email, username, roles }),
};

export { UserDto };
