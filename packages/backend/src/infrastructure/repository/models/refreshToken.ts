import { RefreshToken } from "@backend/domain/entities/refreshToken";
import { model, Schema } from ".";
import { EntitySchema } from "@backend/infrastructure/repository/models/entity";
import { UserModel } from "./user";

const RefreshTokenSchema: Schema<RefreshToken> = {
  ...EntitySchema,
  value: { type: String },
  expires: { type: Date },
  user: { type: String, ref: UserModel, autopopulate: true },
};

const RefreshTokenModel = model<RefreshToken>(
  "RefreshToken",
  RefreshToken,
  RefreshTokenSchema,
  true
);

export { RefreshTokenSchema, RefreshTokenModel };
