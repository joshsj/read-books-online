import { Id } from "@/domain/common/id";
import { User } from "@/domain/entities/user";

type ICurrentUserService = {
  id: Id;
  user: User;
};

export { ICurrentUserService };
