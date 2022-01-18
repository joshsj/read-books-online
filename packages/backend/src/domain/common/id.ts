import { Types } from "mongoose";
import { mixed } from "yup";

type Id = string;

const isId = (id: any): id is Id => Types.ObjectId.isValid(id);
const newId = (): Id => new Types.ObjectId().toString();

const Id = mixed(isId).required().strict();

export { Id, isId, newId };
