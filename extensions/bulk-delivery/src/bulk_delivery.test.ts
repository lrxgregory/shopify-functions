import { describe, expect, it } from "vitest";
import { run } from "./bulk-delivery.ts";

describe("bulk delivery", () => {
  it("should hide standard and express options when all products are bulk", () => {
    const input = {
      cart: {
        lines: [
          { merchandise: { product: { title: "Piscine gonflable géante", metafield: { value: "true" } } } },
          { merchandise: { product: { title: "Canapé géant", metafield: { value: "true" } } } },
        ],
        deliveryGroups: [
          {
            deliveryOptions: [
              { handle: "standard", title: "Standard" },
              { handle: "express", title: "Express" },
              { handle: "bulk", title: "Bulk" },
            ],
          },
        ],
      },
      deliveryCustomization: { metafield: () => ({ value: "" }) },
    };

    const result = run(input);

    expect(result.operations).toEqual([
      { hide: { deliveryOptionHandle: "standard" } },
      { hide: { deliveryOptionHandle: "express" } },
    ]);
  });

  it("should hide bulk option when at least one product is not bulk", () => {
    const input = {
      cart: {
        lines: [
          { merchandise: { product: { title: "Piscine gonflable géante", metafield: { value: "true" } } } },
          { merchandise: { product: { title: "Chaise normale", metafield: { value: "false" } } } },
        ],
        deliveryGroups: [
          {
            deliveryOptions: [
              { handle: "standard", title: "Standard" },
              { handle: "express", title: "Express" },
              { handle: "bulk", title: "Bulk" },
            ],
          },
        ],
      },
      deliveryCustomization: { metafield: () => ({ value: "" }) },
    };

    const result = run(input);

    expect(result.operations).toEqual([
      { hide: { deliveryOptionHandle: "bulk" } },
    ]);
  });
});
