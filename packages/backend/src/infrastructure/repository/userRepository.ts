import { IUserRepository } from "@backend/application/common/interfaces/repository";
import { RefreshTokenValue } from "@backend/domain/entities/refreshToken";
import { User } from "@backend/domain/entities/user";
import { UserModel } from "@backend/infrastructure/repository/models/user";
import { MongoRepository } from "@backend/infrastructure/repository/mongoRepository";

class UserRepository extends MongoRepository<User> implements IUserRepository {
  constructor() {
    super(User, UserModel);
  }

  async getByRefreshToken(value: RefreshTokenValue) {
    return await this.model.findOne({ value }).lean<User>().exec();
  }

  async getByUsername(username: string) {
    return await this.model.findOne({ username }).lean<User>().exec();
  }
}

export { UserRepository };
