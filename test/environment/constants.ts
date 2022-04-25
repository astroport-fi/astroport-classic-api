import { expect } from "chai";
import constants from "../../src/environment/constants";

describe("constants", function () {
  it("production should overwrite all development variables", () => {
    const hasMissing = constants.hasMissingVariables();
    expect(hasMissing).to.be.false;
  });
});
