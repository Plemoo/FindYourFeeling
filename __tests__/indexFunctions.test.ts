import {
  flattenFeelings,
  getFeelingLabel,
  getFeelingPathByKey,
} from "../assets/ts/indexFunctions";

const feelings: INestedFeelings = {
  id: 0,
  key: "root",
  name: "Root",
  children: [
    {
      id: 1,
      key: "family.joy",
      name: "Joy",
      children: [
        { id: 2, key: "joy.happy", name: "Happy" },
        { id: 3, key: "joy.calm", name: "Calm" },
      ],
    },
    { id: 4, key: "family.sadness", name: "Sadness" },
  ],
};

describe("feeling tree helpers", () => {
  it("finds a feeling and returns its path", () => {
    expect(getFeelingPathByKey("joy.happy", feelings)?.map((node) => node.key)).toEqual([
      "root",
      "family.joy",
      "joy.happy",
    ]);
  });

  it("flattens the tree to selectable leaf feelings", () => {
    expect(flattenFeelings(feelings, true).map((node) => node.key)).toEqual([
      "joy.happy",
      "joy.calm",
      "family.sadness",
    ]);
  });

  it("prefers a custom label and resolves the default label", () => {
    expect(getFeelingLabel({ key: "joy.happy" }, feelings)).toBe("Happy");
    expect(getFeelingLabel({ key: "joy.happy", customLabel: "Bright" }, feelings)).toBe("Bright");
  });
});
