const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const itUsesMongo = () => {
  const mongoServer = new MongoMemoryServer();

  beforeEach(async () => await mongoose.connect(await mongoServer.getUri()));

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });
};

export { itUsesMongo };
