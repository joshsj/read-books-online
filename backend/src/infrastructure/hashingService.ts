import { IConfiguration } from "@/application/common/interfaces/configuration";
import { IHashingService } from "@/application/common/interfaces/hashingService";
import { Dependency } from "@/application/dependency";
import bcrypt from "bcrypt";
import { container } from "tsyringe";

class HashingService implements IHashingService {
  async salt() {
    const { hashing } = container.resolve<IConfiguration>(Dependency.configuration);
    return await bcrypt.genSalt(hashing.saltRounds);
  }

  async hash(value: string, salt: string) {
    return await bcrypt.hash(value, salt);
  }

  async compare(plain: string, hash: string) {
    return await bcrypt.compare(plain, hash);
  }
}

export { HashingService };
