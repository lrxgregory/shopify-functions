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

  it("should return no changes if no delivery option is identified", () => {
    const input = {
      cart: {
        lines: [
          { merchandise: { product: { title: "Table", metafield: { value: "false" } } } },
        ],
        deliveryGroups: [
          {
            deliveryOptions: [
              { handle: "unknown-1", title: "Option spéciale" },
              { handle: "unknown-2", title: "Livraison turbo" },
            ],
          },
        ],
      },
      deliveryCustomization: { metafield: () => ({ value: "" }) },
    };

    const result = run(input);

    expect(result.operations).toEqual([]);
  });

  it("should still identify delivery types with varied casing and accents", () => {
    const input = {
      cart: {
        lines: [
          { merchandise: { product: { title: "Produit lourd", metafield: { value: "true" } } } },
        ],
        deliveryGroups: [
          {
            deliveryOptions: [
              { handle: "standard", title: "Standard" },
              { handle: "express", title: "Rapidé" },
              { handle: "bulk", title: "Volumineuse" },
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

  it("should hide only main bulk option when mixed products and keep split bulk", () => {
    const input = {
      cart: {
        lines: [
          { merchandise: { product: { title: "Piscine géante", metafield: { value: "true" } } } },
          { merchandise: { product: { title: "Petit coussin", metafield: null } } },
        ],
        deliveryGroups: [
          {
            deliveryOptions: [
              { handle: "main-standard", title: "Standard" },
              { handle: "main-bulk", title: "Bulk" }
            ],
          },
          {
            deliveryOptions: [
              { handle: "split-bulk", title: "Bulk" }
            ],
          },
        ],
      },
      deliveryCustomization: { metafield: () => ({ value: "" }) },
    };

    const result = run(input);

    expect(result.operations).toEqual([
      { hide: { deliveryOptionHandle: "main-bulk" } },
    ]);
  });

  it("should not hide any bulk option when all products are bulk (including split)", () => {
    const input = {
      cart: {
        lines: [
          { merchandise: { product: { title: "Piscine", metafield: { value: "true" } } } },
          { merchandise: { product: { title: "Spa", metafield: { value: "true" } } } },
        ],
        deliveryGroups: [
          {
            deliveryOptions: [
              { handle: "std", title: "Standard" },
              { handle: "bulk1", title: "Bulk" },
            ],
          },
          {
            deliveryOptions: [
              { handle: "bulk2", title: "Bulk" },
            ],
          },
        ],
      },
      deliveryCustomization: { metafield: () => ({ value: "" }) },
    };

    const result = run(input);

    expect(result.operations).toEqual([
      { hide: { deliveryOptionHandle: "std" } },
    ]);
  });

  it("should identify 'Livraison + installation' as BULK", () => {
    const input = {
      cart: {
        lines: [
          { merchandise: { product: { title: "Peluche", metafield: null } } },
          { merchandise: { product: { title: "Piscine", metafield: { value: "true" } } } },
        ],
        deliveryGroups: [
          {
            deliveryOptions: [
              { handle: "standard", title: "Standard" },
              { handle: "express", title: "Express" },
              { handle: "livraison-installation", title: "Livraison + installation" },
              { handle: "bulk-1", title: "Bulk" },
            ],
          },
        ],
        deliveryOptions: [
          { handle: "bulk2", title: "Bulk" },
        ],
      },
      deliveryCustomization: { metafield: () => ({ value: "" }) },
    };

    const result = run(input);

    expect(result.operations).toEqual([
      { hide: { deliveryOptionHandle: "bulk-1" } },
    ]);
  });

});
