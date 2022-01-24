import { AuditableFilter } from "@backend/application/common/utilities/filters";
import { InferType, object, string } from "yup";

const TicketQuery = object({
  filter: object({
    information: string().strict(),
    created: AuditableFilter.default(undefined).partial(),
  })
    .default(undefined)
    .partial(),
});

type TicketQuery = InferType<typeof TicketQuery>;

export { TicketQuery };
