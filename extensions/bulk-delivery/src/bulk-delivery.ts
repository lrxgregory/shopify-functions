import type {
  FunctionRunResult,
  Operation
} from "../generated/api";
import { isBulk, isExpress, isStandard } from "./identifyDeliveryType.ts";

interface BulkDeliveryRunInput {
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

export function run(input: BulkDeliveryRunInput): FunctionRunResult {
  const { lines, deliveryGroups } = input.cart;

  console.log("deliveryGroups", JSON.stringify(deliveryGroups, null, 2));

  const allBulk = lines.every(line =>
    line.merchandise.product.metafield?.value === "true"
  );

  const operations: Operation[] = [];

  if (allBulk) {
    // All products are bulk - we hide Standard/Express in all groups
    deliveryGroups.forEach(group => {
      group.deliveryOptions.forEach(option => {
        if (isStandard(option)) {
          operations.push({ hide: { deliveryOptionHandle: option.handle } });
        }
        if (isExpress(option)) {
          operations.push({ hide: { deliveryOptionHandle: option.handle } });
        }
      });
    });
  } else {
    // At least one non bulk product - we hide ONLY the bulk of the main group (not the split)
    if (deliveryGroups.length > 0) {
      const mainGroup = deliveryGroups[0]; // First group = main group

      mainGroup.deliveryOptions.forEach(option => {
        if (isBulk(option)) {
          operations.push({ hide: { deliveryOptionHandle: option.handle } });
        }
      });
    }
  }

  return operations.length ? { operations } : NO_CHANGES;
}