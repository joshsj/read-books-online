import { IConfiguration } from "@/application/common/interfaces/configuration";
import { ILogger } from "@/application/common/interfaces/logger";
import { Dependency } from "@/application/dependency";
import { connect } from "mongoose";
import { container } from "tsyringe";

const createMongoConnection = async () => {
  const {
    mongo: { uri, databaseName },
  } = container.resolve<IConfiguration>(Dependency.configuration);

  container
    .resolve<ILogger>(Dependency.logger)
    .log("init", `Connecting to MongoDB ${databaseName} with URI ${uri}`);

  return await connect(uri, { dbName: databaseName });
};

export { createMongoConnection };
