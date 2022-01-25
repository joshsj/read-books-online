import { IRefreshTokenRepository } from "@backend/application/common/interfaces/repository";
import { Id } from "@backend/domain/common/id";
import { RefreshToken, RefreshTokenValue } from "@backend/domain/entities/refreshToken";
import { RefreshTokenModel } from "@backend/infrastructure/repository/models/refreshToken";
import { MongoRepository } from "@backend/infrastructure/repository/mongoRepository";

class RefreshTokenRepository
  extends MongoRepository<RefreshToken>
  implements IRefreshTokenRepository
{
  constructor() {
    super(RefreshToken, RefreshTokenModel);
  }

  async getByValue(value: RefreshTokenValue): Promise<RefreshToken | null> {
    return await this.model.findOne({ value }).lean<RefreshToken>().exec();
  }

  async getByUserId(userId: Id): Promise<RefreshToken | null> {
    return await this.model.findOne({ userId }).lean<RefreshToken>().exec();
  }
}

export { RefreshTokenRepository };
