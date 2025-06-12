// Optimized code
import FingerprintJS from '@fingerprintjs/fingerprintjs';

/**
 * Loads FingerprintJS and gets the visitorId.
 * @returns {Promise<string>} visitorId.
 */
const loadFingerprint = async () => {
    try {
        const fp = await FingerprintJS.load();
        const { visitorId } = await fp.get();
        return visitorId;
    } catch (error) {
        console.error('Error loading FingerprintJS:', error);
        throw new Error('Failed to load FingerprintJS');
    }
};

/**
 * Get or set the user's fingerprint.
 * @param {string} [fpHash] - The fingerprint hash.
 * @returns {Promise<string>} The user's fingerprint.
 */
export const getOrSetFingerprint = async (fpHash = '') => {
    if (fpHash) {
        return fpHash;
    }
    return await loadFingerprint();
};