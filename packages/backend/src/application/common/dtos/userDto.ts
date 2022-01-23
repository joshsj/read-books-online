import { User } from "@backend/domain/entities/user";

type UserDto = Pick<User, "_id" | "username">;

const UserDto = {
  fromUser: ({ _id, username }: User): UserDto => ({ _id, username }),
};

export { UserDto };
