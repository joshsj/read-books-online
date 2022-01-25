import { Entity } from "@backend/domain/common/entity";
import { ReviewState } from "@backend/domain/constants/reviewState";
import { date, InferType, object, string } from "yup";
import { User } from "./user";

const InitialFields = object({
  information: string().strict().required(),

  created: object({
    at: date().strict().required(),
    by: User.required(),
  }),
});

const AdditionalFields = object({
  allocated: object({
    at: date().strict().required(),
    to: User.required(),
  }),

  reviewed: object({
    at: date().strict().required(),
    state: ReviewState.required(),
  }),
}).partial();

const Ticket = Entity.concat(InitialFields).concat(AdditionalFields);

type Ticket = InferType<typeof Ticket>;

export { Ticket };
