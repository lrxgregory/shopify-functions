# Shopify Functions – Conditional Delivery Options

This project contains two custom **Shopify Functions** used to **dynamically hide delivery options** based on the contents of the cart.

Available functions:

- [`bulk-delivery-option`](./extensions/bulk-delivery-option)
- [`installation-delivery-option`](./extensions/installation-delivery-option)

---

## What are Shopify Functions?

**Shopify Functions** allow developers to inject **custom backend logic** directly into Shopify's checkout and other critical paths. They are **server-side, high-performance**, and compiled to WebAssembly (Wasm).

In this project, we use **delivery customization functions** to:

- Hide delivery methods depending on the products in the cart.
- Prevent customer mistakes that could lead to fulfillment issues.

---

## 1. `bulk-delivery-option` – XXL Delivery

### Purpose

Manage orders that contain bulky products requiring a specific "Bulk Delivery" option.

### Business Rules

- If **all products** in the cart are marked as `bulk`, we **hide** the `Standard` and `Express` delivery options.
- If **at least one product** is **not bulk**, we **hide** the `Bulk` delivery option. A **split shipment** logic will then be handled upstream.

### Identifying bulk products

Each product is tagged with a metafield (e.g., `namespace:delivery`, `key:bulk`) set to `"true"` when it requires bulk delivery.

```ts
product.metafield?.value === "true";
```

## Example Input / Output

### Input:

```json
{
  "cart": {
    "lines": [
      {
        "merchandise": {
          "product": {
            "title": "Giant Couch",
            "metafield": { "value": "true" }
          }
        }
      }
    ],
    "deliveryGroups": [
      {
        "deliveryOptions": [
          { "handle": "...", "title": "Standard" },
          { "handle": "...", "title": "Express" },
          { "handle": "...", "title": "Bulk" }
        ]
      }
    ]
  }
}
```

### Output:

```json
{
  "operations": [
    {
      "hide": {
        "deliveryOptionHandle": "standard"
      }
    }
  ]
}
```

## 2. installation-delivery-option – Delivery + Installation

### Purpose

Hide the **"Delivery + Installation"** option when no product in the cart requires installation.

### Business Rules

Products may define a metafield (e.g., `namespace:delivery`, `key:installation`) with value `"true"`.

If **no product** in the cart requires installation → the delivery option is **hidden**.

### Example

- Couch = installation: true
- Lamp = installation: false

→ If **all products** have installation set to false → hide the delivery option.

---

## Running Tests

The functions are unit tested with [Vitest](https://vitest.dev/).

### Run all tests

```bash
npm run test
```

## Deployment

### Manually build a function

```bash
shopify app function build
```

### Deploy to Shopify

```bash
shopify app deploy
```

### Note: Delivery option handle values can change between environments and deployments. It is recommended to rely on delivery option titles or use metafields to associate specific behaviors to delivery methods.

---

## 📁 Project Structure

```bash
extensions/
├── bulk-delivery/                    # Bulk delivery function
│   ├── src/
│   │   ├── bulk-delivery.ts        # Main function logic
│   │   ├── bulk_delivery.test.ts    # Unit tests
│   │   ├── config.ts               # Configuration and constants
│   │   ├── identifyDeliveryType.ts # Delivery type identification
│   │   └── index.ts                # Exports
│   ├── shopify.extension.toml       # Extension configuration
│   └── package.json
├── installation-option/             # Installation option function
│   ├── src/
│   │   ├── config.ts               # Configuration
│   │   ├── installation_option.ts   # Main function
│   │   ├── installation_option.test.ts  # Tests
│   │   └── isDeliveryOptionOfType.ts    # Type utilities
│   ├── shopify.extension.toml       # Extension config
│   └── package.json
└── checkout-function.toml           # Root config
```
