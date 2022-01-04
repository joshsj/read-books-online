import { IHashingService } from "@/application/common/interfaces/hashingService";
import bcrypt from "bcrypt";

class HashingService implements IHashingService {
  constructor(private readonly saltRounds: number) {}

  async salt() {
    return await bcrypt.genSalt(this.saltRounds);
  }

  async hash(value: string, salt: string) {
    return await bcrypt.hash(value, salt);
  }

  async compare(plain: string, hash: string) {
    return await bcrypt.compare(plain, hash);
  }
}

export { HashingService };
