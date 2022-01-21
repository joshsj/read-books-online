import { Id } from "@backend/domain/common/id";
import { DateFilter } from "@backend/domain/filters";
import { array, InferType, object, string } from "yup";

const TicketQuery = object({
  filter: object({
    information: string().strict().optional(),
    createdAt: DateFilter,
    createdBy: array().of(Id).strict(),
  }),
});

type TicketQuery = InferType<typeof TicketQuery>;

export { TicketQuery };
