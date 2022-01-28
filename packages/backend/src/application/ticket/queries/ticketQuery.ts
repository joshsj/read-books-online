import { Id } from "@backend/domain/common/id";
import { InferType, object, string } from "yup";

const TicketQuery = object({
  filter: object({
    information: string().strict(),
    userId: Id,
  })
    .default(undefined)
    .partial(),
});

type TicketQuery = InferType<typeof TicketQuery>;

export { TicketQuery };
