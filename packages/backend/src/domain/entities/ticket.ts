import { Auditable } from "@backend/domain/common/auditable";
import { Entity } from "@backend/domain/common/entity";
import { ReviewState } from "@backend/domain/constants/reviewState";
import { object, ObjectSchema, string } from "yup";

type Ticket = Entity &
  Auditable<"created"> &
  Partial<Auditable<"allocated" | "reviewed">> & {
    information: string;
    reviewState?: ReviewState;
  };

const Ticket: ObjectSchema<Ticket> = object({
  information: string().strict().required(),
  reviewState: ReviewState.optional(),
})
  .concat(Entity)
  .concat(Auditable("created"))
  .concat(Auditable("allocated").partial())
  .concat(Auditable("reviewed").partial());

export { Ticket };
