import { parseIngredient } from "./posts";

describe("parseIngredient", () => {
  it("works", () => {
    const result = parseIngredient("220 g", "white flour");
    expect(result).toEqual({
      quantity: { type: "weight", value: 220 },
      name: "white flour",
    });
  });
});
