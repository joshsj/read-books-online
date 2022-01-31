import { User } from "@backend/domain/entities/user";

type BriefUserDto = Pick<User, "_id" | "username">;

const BriefUserDto = {
  fromUser: ({ _id, username }: User): BriefUserDto => ({ _id, username }),
};

export { BriefUserDto };
