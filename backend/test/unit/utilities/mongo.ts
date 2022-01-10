import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let instance: MongoMemoryServer | undefined = undefined;
let clients = 0;

const itUsesMongo = () =>
  before(async () => {
    ++clients;

    if (!instance) {
      instance = await MongoMemoryServer.create();
      await mongoose.connect(instance.getUri());
    }

    beforeEach(async () => await mongoose.connection.dropDatabase());

    after(async () => {
      --clients;

      if (!clients) {
        await mongoose.connection.close();
        await instance!.stop();
        instance = undefined;
      }
    });
  });

export { itUsesMongo };
