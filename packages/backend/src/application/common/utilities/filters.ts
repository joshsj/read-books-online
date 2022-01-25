import { date, InferType, object } from "yup";

const DateFilter = object({
  from: date().strict().required(),
  to: date().strict().required(),
}).default(undefined);
type DateFilter = InferType<typeof DateFilter>;

export { DateFilter };
