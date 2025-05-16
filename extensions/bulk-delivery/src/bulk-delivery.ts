import type {
  FunctionRunResult,
  Operation
} from "../generated/api";

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
  const lines = input.cart.lines;

  const allBulk = lines.every(line =>
    line.merchandise.product.metafield?.value === "true"
  );

  const operations: Operation[] = [];

  const allOptions = input.cart.deliveryGroups
    .flatMap(group => group.deliveryOptions);

  const standardOption = allOptions.find(o => o.title === "Standard");
  const expressOption = allOptions.find(o => o.title === "Express");
  const bulkOption = allOptions.find(o => o.title === "Bulk");

  console.log("bulkOption", bulkOption);

  if (allBulk) {
    if (standardOption) {
      operations.push({ hide: { deliveryOptionHandle: standardOption.handle } });
    }
    if (expressOption) {
      operations.push({ hide: { deliveryOptionHandle: expressOption.handle } });
    }
  } else {
    if (bulkOption) {
      operations.push({ hide: { deliveryOptionHandle: bulkOption.handle } });
    }
  }

  return operations.length ? { operations } : NO_CHANGES;
}