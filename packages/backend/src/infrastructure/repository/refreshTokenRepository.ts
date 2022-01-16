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

  async getByValue(value: RefreshTokenValue): Promise<RefreshToken | undefined> {
    return (await this.model.findOne({ value })) ?? undefined;
  }

  async getByUserId(userId: Id): Promise<RefreshToken | undefined> {
    return (await this.model.findOne({ userId })) ?? undefined;
  }
}

export { RefreshTokenRepository };
