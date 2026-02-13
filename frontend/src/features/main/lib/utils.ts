/**
 * Utility functions for the main features module
 */

/**
 * Convert a File to a base64 string (data portion only, no prefix)
 */
export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            // Strip the data:...;base64, prefix
            const base64 = result.split(',')[1] || result;
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Format a number according to a language/locale.
 * Uses Intl.NumberFormat for proper localisation.
 */
const LOCALE_MAP: Record<string, string> = {
    en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN', bn: 'bn-IN',
    mr: 'mr-IN', gu: 'gu-IN', kn: 'kn-IN', ml: 'ml-IN', pa: 'pa-IN',
    or: 'or-IN', ur: 'ur-IN', as: 'as-IN', sa: 'sa-IN',
};

export function getLocalizedNumber(
    num: number | string,
    language: string = 'en',
): string {
    const value = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(value)) return String(num);

    const locale = LOCALE_MAP[language] || 'en-IN';
    try {
        return new Intl.NumberFormat(locale).format(value);
    } catch {
        return String(value);
    }
}
