import { IConfiguration } from "@/application/common/interfaces/configuration";
import { HashingService } from "@/infrastructure/hashingService";
import { createConfiguration } from "@/test/utilities/mocks";
import { expect } from "chai";

const newSut = (config?: IConfiguration) => new HashingService(config ?? createConfiguration());

describe("Hashing Service", () => {
  describe("salt()", () => {
    it("Returns a value", () => {
      const sut = newSut();

      return expect(sut.salt()).eventually.satisfies((x: any) => typeof x === "string" && x.length > 0);
    });
  });

  describe("hash()", () => {
    it("Returns a value", async () => {
      const sut = newSut();

      const toBeHashed = "toBeHashed";
      const salt = await sut.salt();

      return expect(sut.hash(toBeHashed, salt)).eventually.satisfies((x: any) => typeof x === "string" && x.length > 0);
    });
  });

  describe("compare()", () => {
    it("Correctly compares a plain string and its valid hash", async () => {
      const sut = newSut();

      const plain = "plain";
      const hash = await sut.hash(plain, await sut.salt());

      return expect(sut.compare(plain, hash)).eventually.to.be.true;
    });

    it("Correctly compares a plain string and an incorrect hash", async () => {
      const sut = newSut();

      const plain = "plain";
      const hash = "hash";

      return expect(sut.compare(plain, hash)).eventually.to.be.false;
    });
  });
});
