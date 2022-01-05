import { IConfiguration } from "@/application/common/interfaces/configuration";
import { Dependency } from "@/application/dependency";
import { connect } from "mongoose";
import { container } from "tsyringe";

const createMongoConnection = async () => {
  const {
    mongo: { uri, databaseName },
  } = container.resolve<IConfiguration>(Dependency.configuration);

  return await connect(uri, { dbName: databaseName });
};

export { createMongoConnection };
