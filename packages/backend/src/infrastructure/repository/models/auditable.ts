import { Auditable } from "@backend/domain/common/auditable";
import { UserModel } from "@backend/infrastructure/repository/models/user";
import { Schema } from ".";

const AuditableSchema = <T extends string>(t: T): Schema<Auditable<T>> =>
  ({
    [`${t}At`]: {
      type: Date,
    },

    [`${t}By`]: {
      type: String,
      ref: UserModel,
      autopopulate: true,
    },
  } as Schema<Auditable<T>>);

export { AuditableSchema };
