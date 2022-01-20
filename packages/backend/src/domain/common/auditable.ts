import { User } from "@backend/domain/entities/user";
import { date, object, ObjectSchema } from "yup";

/** @template T Prefix for field names, should be past tense */
type Auditable<T extends string> = {
  [K in `${T}At`]: Date;
} & {
  [K in `${T}By`]: User;
};

const Auditable = <T extends string>(t: T): ObjectSchema<Auditable<T>> =>
  object({
    [`${t}At`]: date().strict().required(),
    [`${t}By`]: User.required(),
  }) as ObjectSchema<Auditable<T>>;

export { Auditable };
