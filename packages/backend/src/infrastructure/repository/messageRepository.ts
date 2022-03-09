import { IMessageRepository } from "@backend/application/common/interfaces/repository";
import { Message } from "@backend/domain/entities/message";
import { MessageModel } from "./models/message";
import { MongoRepository } from "./mongoRepository";

class MessageRepository extends MongoRepository<Message> implements IMessageRepository {
  constructor() {
    super(Message, MessageModel);
  }
}

export { MessageRepository };
