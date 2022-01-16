import { HttpContextService } from "@backend/infrastructure/httpContextService";
import { expect } from "chai";
import { Request, Response } from "express";

describe("HTTP Context Service", () => {
  describe("getCurrent()", () => {
    it("Provides the correct values", async () => {
      const req = {} as Request;
      const res = {} as Response;

      const sut = new HttpContextService({ id: 0, req, res });
      const result = sut.getCurrent();

      expect(result.req).to.equal(req);
      expect(result.res).to.equal(res);
    });
  });
});
