import { date, InferType, object } from "yup";

const DateFilter = object({
  from: date().strict(),
  to: date().strict(),
});

type DateFilter = InferType<typeof DateFilter>;

export { DateFilter };
