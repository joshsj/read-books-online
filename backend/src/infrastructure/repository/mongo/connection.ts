import { connect } from "mongoose";

const createMongoConnection = (uri: string, dbName: string) =>
  connect(uri, { dbName });

export { createMongoConnection };
