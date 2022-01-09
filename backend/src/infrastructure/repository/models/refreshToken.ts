import { RefreshToken } from "@/domain/entities/refreshToken";
import { model, Schema } from ".";
import { EntitySchema } from "@/infrastructure/repository/models/entity";

const RefreshTokenSchema: Schema<RefreshToken> = {
  ...EntitySchema,
  value: { type: String },
  expires: { type: Date },
  userId: { type: String },
};

const RefreshTokenModel = model<RefreshToken>("RefreshToken", RefreshToken, RefreshTokenSchema);

export { RefreshTokenSchema, RefreshTokenModel };
