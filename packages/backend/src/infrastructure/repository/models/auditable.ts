import { Auditable } from "@backend/domain/common/auditable";
import { UserModel } from "@backend/infrastructure/repository/models/user";
import { Schema } from ".";

const AuditableSchema = <T extends string>(t: T) =>
  ({
    [t]: {
      at: { type: Date },
      by: {
        type: String,
        ref: UserModel,
        autopopulate: true,
      },
    },
  } as unknown as Schema<Auditable<T>>);

export { AuditableSchema };
