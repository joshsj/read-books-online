import { expect } from "chai";
import fetch from "node-fetch";
import { getConfiguration } from "@client/test/integration/utilities/configuration";

describe("Configuration", () => {
  const { apiUrl } = getConfiguration();

  it("Responds with correct headers", async () => {
    const result = fetch(apiUrl + "/test/hello");

    const expected: Partial<Response> = { status: 200 };

    return expect(result)
      .eventually.to.be.fulfilled.and.include(expected)
      .and.satisfy(
        (res: Response) => res.headers.get("Content-Type")?.startsWith("application/json") ?? false
      );
  });
});
