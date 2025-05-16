import type {
  FunctionRunResult,
  Operation
} from "../generated/api";

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

  const hasInstallationProduct = lines.some(line =>
    line.merchandise.product.metafield?.value === "true"
  );

  const operations: Operation[] = [];

  const allOptions = input.cart.deliveryGroups
    .flatMap(group => group.deliveryOptions);

  const installationOption = allOptions.find(o => o.title === "Livraison + installation");

  if (!hasInstallationProduct) {
    if (installationOption) {
      operations.push({ hide: { deliveryOptionHandle: installationOption.handle } });
    }
  }

  return operations.length ? { operations } : NO_CHANGES;
}