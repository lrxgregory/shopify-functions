import { DELIVERY_OPTIONS } from "./config";

export function isDeliveryOptionOfType(
    option: { title: string },
    typeConfig: typeof DELIVERY_OPTIONS.INSTALLATION,
    languages: string[] = Object.keys(typeConfig.identifiers)
): boolean {
    const titleLower = option.title.toLowerCase();

    for (const lang of languages) {
        const terms = typeConfig.identifiers[lang] || [];

        if (terms.some((term: string) => titleLower.includes(term.toLowerCase()))) {
            return true;
        }
    }

    return false;
}
