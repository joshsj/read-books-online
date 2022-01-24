import { Id } from "@backend/domain/common/id";
import { array, date, InferType, object } from "yup";

const DateFilter = object({
  from: date().strict().required(),
  to: date().strict().required(),
}).default(undefined);
type DateFilter = InferType<typeof DateFilter>;

const AuditableFilter = object({
  at: DateFilter,
  by: array().of(Id).strict(),
}).default(undefined);
type AuditableFilter = InferType<typeof AuditableFilter>;

export { DateFilter, AuditableFilter };
