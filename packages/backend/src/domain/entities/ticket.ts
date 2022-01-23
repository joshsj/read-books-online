import { Auditable } from "@backend/domain/common/auditable";
import { Entity } from "@backend/domain/common/entity";
import { InferType, object, string } from "yup";

const Ticket = object({
  information: string().strict().required(),
})
  .concat(Entity)
  .concat(Auditable("created"))
  .concat(Auditable("allocated").partial());

type Ticket = InferType<typeof Ticket>;

export { Ticket };
