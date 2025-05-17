export const DELIVERY_TYPES = {
    STANDARD: {
        id: "standard",
        identifiers: {
            fr: ["standard", "normale", "regulier", "regulière"],
            en: ["standard", "regular", "normal"],
            es: ["estándar", "normal", "regular"],
        },
    },
    EXPRESS: {
        id: "express",
        identifiers: {
            fr: ["express", "rapide", "prioritaire", "urgent"],
            en: ["express", "fast", "priority", "urgent"],
            es: ["exprés", "expreso", "rápido", "prioritario"],
        },
    },
    BULK: {
        id: "bulk",
        identifiers: {
            fr: ["bulk", "gros volume", "palette", "grande quantité", "volumineuse"],
            en: ["bulk", "large volume", "pallet", "large quantity"],
            es: ["volumen", "gran cantidad", "paleta", "voluminoso"],
        },
    },
};
