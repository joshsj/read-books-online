import { GlobalMochaOptions } from "@core/utilities/test";
import glob from "fast-glob";
import Mocha from "mocha";
import path from "path";

const main = async () => {
  const testFilePaths = await glob("**/*.spec.js", { cwd: __dirname });

  const mocha = new Mocha({
    ...GlobalMochaOptions,
    timeout: 5000, // extra allowance for mongodb-memory-server
  });

  testFilePaths.forEach((p) => mocha.addFile(path.join(__dirname, p)));

  mocha.run();
};

main();
