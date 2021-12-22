import { User } from "@/domain/entities/user";
import { IRepository } from ".";

type UserRepository = IRepository<User, string>;

export { UserRepository };
