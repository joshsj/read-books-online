import { User } from "@backend/domain/entities/user";

type UserDto = Pick<User, "_id" | "username">;

const userDto = {
  fromUser: ({ _id, username }: User): UserDto => ({ _id, username }),
};

export { userDto, UserDto };
