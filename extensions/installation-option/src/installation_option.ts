import type { FunctionRunResult } from "../generated/api";
import { DELIVERY_OPTIONS } from "./config.ts";
import { isDeliveryOptionOfType } from "./isDeliveryOptionOfType.ts";

interface InstallationDeliveryRunInput {
  cart: {
    lines: Array<{
      merchandise: {
        product: {
          title: string;
          metafield: {
            value: string;
          } | null;
        };
      };
    }>;
    deliveryGroups: {
      deliveryOptions: {
        handle: string;
        title: string;
      }[];
    }[];
  };
  deliveryCustomization: {
    metafield: (namespace: string, key: string) => { value: string };
  };
}

const NO_CHANGES: FunctionRunResult = {
  operations: [],
};

export function run(input: InstallationDeliveryRunInput): FunctionRunResult {
  const lines = input.cart.lines;

  const hasInstallationProduct = lines.some(
    (line) => line.merchandise.product.metafield?.value === "true"
  );

  const allOptions = input.cart.deliveryGroups.flatMap(
    (group) => group.deliveryOptions
  );

  const installationOptions = allOptions.filter((option) =>
    isDeliveryOptionOfType(option, DELIVERY_OPTIONS.INSTALLATION)
  );

  if (!hasInstallationProduct && installationOptions.length > 0) {
    return {
      operations: [
        { hide: { deliveryOptionHandle: installationOptions[0].handle } },
      ],
    };
  }

  return NO_CHANGES;
}