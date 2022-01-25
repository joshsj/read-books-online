import { DateFilter } from "@backend/application/common/utilities/filters";
import { Id } from "@backend/domain/common/id";
import { array, InferType, object, string } from "yup";

const TicketQuery = object({
  filter: object({
    information: string().strict(),
    created: object({
      at: DateFilter,
      by: array().of(Id).strict(),
    })
      .default(undefined)
      .partial(),
  })
    .default(undefined)
    .partial(),
});

type TicketQuery = InferType<typeof TicketQuery>;

export { TicketQuery };
