import { Auditable } from "@backend/domain/common/auditable";
import { Types } from "mongoose";
import { Schema } from ".";

import { UserModel } from "@backend/infrastructure/repository/models/user";

const AuditableSchema = <T extends string>(t: T): Schema<Auditable<T>> =>
  ({
    [`${t}At`]: { type: Date },
    [`${t}By`]: {
      type: Types.ObjectId,
      ref: UserModel,
      autopopulate: true,
    },
  } as Schema<Auditable<T>>);

export { AuditableSchema };
