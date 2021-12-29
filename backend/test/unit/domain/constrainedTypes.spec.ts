import { Length } from "@/domain/common/constrainedTypes";
import { expect } from "chai";
import { describe } from "mocha";
import { String } from "runtypes";

describe("Constrained Types", () => {
  describe("Length", () => {
    it("Applies a minimum", () => {
      const sut = Length(String, { min: 4 });

      expect(sut.guard("abcde")).to.be.true;
      expect(sut.guard("abc")).to.be.false;
    });

    it("Applies a maximum", () => {
      const sut = Length(String, { max: 4 });

      expect(sut.guard("abc")).to.be.true;
      expect(sut.guard("abcde")).to.be.false;
    });

    it("Applies a minimum and maximum", () => {
      const sut = Length(String, { min: 2, max: 4 });

      expect(sut.guard("abc")).to.be.true;
      expect(sut.guard("a")).to.be.false;
      expect(sut.guard("abcde")).to.be.false;
    });
  });
});
