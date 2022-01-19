import { Entity } from "@backend/domain/common/entity";
import { InferType, object, string } from "yup";

const Ticket = Entity.concat(
  object({
    information: string().strict().required(),
  })
);

type Ticket = InferType<typeof Ticket>;

export { Ticket };
