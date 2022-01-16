import { IUserRepository } from "@/application/common/interfaces/repository";
import { RefreshTokenValue } from "@/domain/entities/refreshToken";
import { User } from "@/domain/entities/user";
import { UserModel } from "@/infrastructure/repository/models/user";
import { MongoRepository } from "@/infrastructure/repository/mongoRepository";

class UserRepository extends MongoRepository<User> implements IUserRepository {
  constructor() {
    super(User, UserModel);
  }

  async getByRefreshToken(value: RefreshTokenValue): Promise<User | undefined> {
    return (await this.model.findOne({ value })) ?? undefined;
  }

  async getByUsername(username: string) {
    return (await this.model.findOne({ username })) ?? undefined;
  }
}

export { UserRepository };
