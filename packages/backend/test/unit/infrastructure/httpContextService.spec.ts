import { HttpContextService } from "@backend/infrastructure/httpContextService";
import { expect } from "chai";

describe("HTTP Context Service", () => {
  describe("getCurrent()", () => {
    it("Provides the correct values", async () => {
      const authenticationTokenValue = "authenticationTokenValue";
      const refreshTokenValue = "refreshTokenValue";

      const sut = new HttpContextService({
        id: 0,
        authenticationTokenValue,
        refreshTokenValue,
      });
      const result = sut.getCurrent();

      expect(result.authenticationTokenValue).to.equal(authenticationTokenValue);
      expect(result.refreshTokenValue).to.equal(refreshTokenValue);
    });
  });
});
