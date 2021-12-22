import { UserRepository } from "@/application/common/interfaces/repository/userRepository";
import { Dependency } from "@/application/dependency";
import { container } from "tsyringe";
import { UserModel } from "./repository/mongo/models/user";
import { MongoRepository } from "./repository/mongo/repository";

const registerInfrastructureDependencies = () => {
  container.register<UserRepository>(Dependency.userRepository, {
    useValue: new MongoRepository(UserModel),
  });
};

export { Dependency, registerInfrastructureDependencies };
