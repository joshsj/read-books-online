import { GlobalMochaOptions } from "@backend/test/config";
import glob from "fast-glob";
import Mocha from "mocha";
import path from "path";

const main = async () => {
  const testFilePaths = await glob("**/*.spec.js", { cwd: __dirname });

  const mocha = new Mocha(GlobalMochaOptions);

  testFilePaths.forEach((p) => mocha.addFile(path.join(__dirname, p)));

  mocha.run((failures) => (process.exitCode = failures ? 1 : 0));
};

main();
