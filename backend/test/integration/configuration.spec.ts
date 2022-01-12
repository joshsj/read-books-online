import { Env } from "@/test/integration/utilities";
import { ok } from "@/web/common/utilities/http";
import { expect } from "chai";
import fetch from "node-fetch";

describe("Configuration", () => {
  it("Responds with correct headers", async () => {
    const result = fetch(Env.BASE_URL + "/test/hello");

    return expect(result)
      .eventually.to.be.fulfilled.and.include(ok)
      .and.satisfy(
        (res: Response) => res.headers.get("Content-Type")?.startsWith("application/json") ?? false
      );
  });
});
