import { describe, expect, it } from "vitest";
import { run } from "./installation_option";

describe("installation delivery", () => {
  it("should show installation option when installation product is present (value='true')", () => {
    const input = {
      cart: {
        lines: [
          {
            merchandise: {
              product: {
                title: "Vélo avec installation",
                metafield: { value: "true" },
              },
            },
          },
        ],
        deliveryGroups: [
          {
            deliveryOptions: [
              { handle: "standard", title: "Standard" },
              { handle: "express", title: "Express" },
              { handle: "installation", title: "Livraison + installation" },
            ],
          },
        ],
      },
      deliveryCustomization: {
        metafield: () => ({ value: "" }),
      },
    };

    const result = run(input);

    // Pas d'opération pour cacher installation, donc operations = []
    expect(result.operations).toEqual([]);
  });

  it("should hide installation option when installation product is NOT present (value === 'false')", () => {
    const input = {
      cart: {
        lines: [
          {
            merchandise: {
              product: {
                title: "Vélo sans installation",
                metafield: { value: "false" },
              },
            },
          },
        ],
        deliveryGroups: [
          {
            deliveryOptions: [
              { handle: "standard", title: "Standard" },
              { handle: "express", title: "Express" },
              { handle: "installation", title: "Livraison + installation" },
            ],
          },
        ],
      },
      deliveryCustomization: {
        metafield: () => ({ value: "" }),
      },
    };

    const result = run(input);

    // On cache l'option installation
    expect(result.operations).toEqual([
      { hide: { deliveryOptionHandle: "installation" } },
    ]);
  });

  it("should hide installation option when installation product is NOT present (value === '')", () => {
    const input = {
      cart: {
        lines: [
          {
            merchandise: {
              product: {
                title: "Vélo sans installation",
                metafield: { value: "" },
              },
            },
          },
        ],
        deliveryGroups: [
          {
            deliveryOptions: [
              { handle: "standard", title: "Standard" },
              { handle: "express", title: "Express" },
              { handle: "installation", title: "Livraison + installation" },
            ],
          },
        ],
      },
      deliveryCustomization: {
        metafield: () => ({ value: "" }),
      },
    };

    const result = run(input);

    // On cache l'option installation
    expect(result.operations).toEqual([
      { hide: { deliveryOptionHandle: "installation" } },
    ]);
  });

  it("should hide installation option when installation product is NOT present (value === null)", () => {
    const input = {
      cart: {
        lines: [
          {
            merchandise: {
              product: {
                title: "Vélo sans installation",
                metafield: null,
              },
            },
          },
        ],
        deliveryGroups: [
          {
            deliveryOptions: [
              { handle: "standard", title: "Standard" },
              { handle: "express", title: "Express" },
              { handle: "installation", title: "Livraison + installation" },
            ],
          },
        ],
      },
      deliveryCustomization: {
        metafield: () => ({ value: "" }),
      },
    };

    const result = run(input);

    // On cache l'option installation
    expect(result.operations).toEqual([
      { hide: { deliveryOptionHandle: "installation" } },
    ]);
  });

  it("should hide installation option when installation product is NOT present (value === undefined)", () => {
    const input = {
      cart: {
        lines: [
          {
            merchandise: {
              product: {
                title: "Vélo sans installation",
                metafield: undefined,
              },
            },
          },
        ],
        deliveryGroups: [
          {
            deliveryOptions: [
              { handle: "standard", title: "Standard" },
              { handle: "express", title: "Express" },
              { handle: "installation", title: "Livraison + installation" },
            ],
          },
        ],
      },
      deliveryCustomization: {
        metafield: () => ({ value: "" }),
      },
    };

    const result = run(input);

    // On cache l'option installation
    expect(result.operations).toEqual([
      { hide: { deliveryOptionHandle: "installation" } },
    ]);
  });
});
