import { Env } from "@backend/test/integration/utilities";
import { expect } from "chai";
import fetch from "node-fetch";

describe("Configuration", () => {
  it("Responds with correct headers", async () => {
    const result = fetch(Env.BASE_URL + "/test/hello");

    const expected: Partial<Response> = { status: 200 };

    return expect(result)
      .eventually.to.be.fulfilled.and.include(expected)
      .and.satisfy(
        (res: Response) => res.headers.get("Content-Type")?.startsWith("application/json") ?? false
      );
  });
});
