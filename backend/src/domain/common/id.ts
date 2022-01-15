import { v4 as uuid, validate, version } from "uuid";
import { mixed } from "yup";

type Id = string;

const isId = (id: any): id is Id => validate(id) && version(id) === 4;
const newId = (): Id => uuid();

const Id = mixed(isId).required().strict();

export { Id, isId, newId };
