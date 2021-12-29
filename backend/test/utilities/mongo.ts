import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const itUsesMongo = () =>
  before(async () => {
    beforeEach(async () => await mongoose.connection.dropDatabase());

    after(async () => {
      await mongoose.connection.close();
      await mongoServer.stop();
    });

    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

export { itUsesMongo };
