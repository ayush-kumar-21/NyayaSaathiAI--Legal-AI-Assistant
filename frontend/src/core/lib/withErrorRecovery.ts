/**
 * withErrorRecovery — wraps an async function with try/catch,
 * returning a fallback value on failure instead of throwing.
 */
export async function withErrorRecovery<T>(
    fn: () => Promise<T>,
    fallback: T
): Promise<T> {
    try {
        return await fn();
    } catch (error) {
        console.error('[withErrorRecovery] Operation failed, using fallback:', error);
        return fallback;
    }
}
