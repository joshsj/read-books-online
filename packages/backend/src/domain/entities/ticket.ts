import { Entity } from "@backend/domain/common/entity";
import { Auditable } from "@backend/domain/common/auditable";
import { InferType, object, string } from "yup";

const Ticket = object({
  information: string().strict().required(),
})
  .concat(Entity)
  .concat(Auditable("created"));

type Ticket = InferType<typeof Ticket>;

export { Ticket };
