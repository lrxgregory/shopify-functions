import { DELIVERY_TYPES } from "./config";

type DeliveryOption = { title: string; handle: string };
type DeliveryOptionType = keyof typeof DELIVERY_TYPES;

// Remplace les accents (sans .normalize)
function escapeAccents(str: string): string {
    return str
        .toLowerCase()
        .replace(/[àáâãäå]/g, "a")
        .replace(/[ç]/g, "c")
        .replace(/[èéêë]/g, "e")
        .replace(/[ìíîï]/g, "i")
        .replace(/[ñ]/g, "n")
        .replace(/[òóôõö]/g, "o")
        .replace(/[ùúûü]/g, "u")
        .replace(/[ýÿ]/g, "y");
}

export function identifyDeliveryOption(
    option: DeliveryOption,
    type: DeliveryOptionType,
    languages: string[] = ['fr', 'en', 'es']
): boolean {
    const config = DELIVERY_TYPES[type];
    const cleanedTitle = escapeAccents(option.title);

    for (const lang of languages) {
        const terms = config.identifiers[lang as keyof typeof config.identifiers];
        if (terms) {
            for (const term of terms) {
                const cleanedTerm = escapeAccents(term);
                const regex = new RegExp(`\\b${cleanedTerm}\\b`, "i");
                if (regex.test(cleanedTitle)) {
                    return true;
                }
            }
        }
    }

    return false;
}


export function isStandard(option: DeliveryOption): boolean {
    return identifyDeliveryOption(option, 'STANDARD');
}

export function isExpress(option: DeliveryOption): boolean {
    return identifyDeliveryOption(option, 'EXPRESS');
}

export function isBulk(option: DeliveryOption): boolean {
    return identifyDeliveryOption(option, 'BULK');
}
