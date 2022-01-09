import { IRefreshTokenRepository } from "@/application/common/interfaces/repository";
import { Id } from "@/domain/common/id";
import { RefreshToken, RefreshTokenValue } from "@/domain/entities/refreshToken";
import { RefreshTokenModel } from "@/infrastructure/repository/models/refreshToken";
import { MongoRepository } from "@/infrastructure/repository/mongoRepository";

class RefreshTokenRepository extends MongoRepository<RefreshToken> implements IRefreshTokenRepository {
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
