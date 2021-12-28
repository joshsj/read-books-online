import { User } from "@/domain/entities/user";
import { getModelForClass } from "@typegoose/typegoose";

const UserModel = getModelForClass(User);

export { UserModel };
