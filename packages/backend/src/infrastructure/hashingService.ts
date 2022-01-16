import { IConfiguration } from "@backend/application/common/interfaces/configuration";
import { IHashingService } from "@backend/application/common/interfaces/hashingService";
import bcrypt from "bcrypt";

class HashingService implements IHashingService {
  constructor(private readonly configuration: IConfiguration) {}

  async salt() {
    return await bcrypt.genSalt(this.configuration.hashing.saltRounds);
  }

  async hash(value: string, salt: string) {
    return await bcrypt.hash(value, salt);
  }

  async compare(plain: string, hash: string) {
    return await bcrypt.compare(plain, hash);
  }
}

export { HashingService };
