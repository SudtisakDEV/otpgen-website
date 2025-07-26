// TOTP (Time-based One-Time Password) Generator
// RFC 6238 Implementation

/**
 * Base32 decoder for secret keys
 * @param {string} base32 - Base32 encoded string
 * @returns {Uint8Array} - Decoded bytes
 */
function base32Decode(base32) {
    const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    base32 = base32.replace(/\s/g, '').toUpperCase();
    
    let bits = '';
    for (let i = 0; i < base32.length; i++) {
        const char = base32[i];
        const index = base32Chars.indexOf(char);
        if (index === -1) continue;
        bits += index.toString(2).padStart(5, '0');
    }
    
    const bytes = [];
    for (let i = 0; i < bits.length; i += 8) {
        if (i + 8 <= bits.length) {
            bytes.push(parseInt(bits.substr(i, 8), 2));
        }
    }
    
    return new Uint8Array(bytes);
}

/**
 * HMAC-SHA1 implementation using Web Crypto API
 * @param {Uint8Array} key - Secret key
 * @param {Uint8Array} message - Message to sign
 * @returns {Promise<Uint8Array>} - HMAC signature
 */
async function hmacSHA1(key, message) {
    try {
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            key,
            { name: 'HMAC', hash: 'SHA-1' },
            false,
            ['sign']
        );
        
        const signature = await crypto.subtle.sign('HMAC', cryptoKey, message);
        return new Uint8Array(signature);
    } catch (error) {
        console.error('HMAC-SHA1 error:', error);
        throw new Error('Failed to compute HMAC-SHA1');
    }
}

/**
 * Generate TOTP code
 * @param {string} secret - Base32 encoded secret key
 * @param {number} window - Time window offset (default: 0)
 * @param {number} timeStep - Time step in seconds (default: 30)
 * @param {number} digits - Number of digits (default: 6)
 * @returns {Promise<string>} - TOTP code
 */
async function generateTOTP(secret, window = 0, timeStep = 30, digits = 6) {
    try {
        // Current time step
        const epoch = Math.floor(Date.now() / 1000);
        const currentTimeStep = Math.floor(epoch / timeStep) + window;
        
        // Convert time step to 8-byte buffer (big-endian)
        const timeBuffer = new ArrayBuffer(8);
        const timeView = new DataView(timeBuffer);
        timeView.setUint32(4, currentTimeStep, false); // big-endian
        
        // Decode secret key
        const keyBytes = base32Decode(secret);
        if (keyBytes.length === 0) {
            throw new Error('Invalid secret key');
        }
        
        // Compute HMAC-SHA1
        const hmac = await hmacSHA1(keyBytes, new Uint8Array(timeBuffer));
        
        // Dynamic truncation (RFC 4226)
        const offset = hmac[hmac.length - 1] & 0x0f;
        const code = (
            ((hmac[offset] & 0x7f) << 24) |
            ((hmac[offset + 1] & 0xff) << 16) |
            ((hmac[offset + 2] & 0xff) << 8) |
            (hmac[offset + 3] & 0xff)
        ) % Math.pow(10, digits);
        
        return code.toString().padStart(digits, '0');
    } catch (error) {
        console.error('TOTP generation error:', error);
        throw new Error('Failed to generate TOTP code');
    }
}

/**
 * Validate secret key format
 * @param {string} secret - Secret key to validate
 * @returns {boolean} - True if valid
 */
function validateSecretKey(secret) {
    if (!secret || typeof secret !== 'string') {
        return false;
    }
    
    // Remove spaces and convert to uppercase
    const cleanSecret = secret.replace(/\s/g, '').toUpperCase();
    
    // Check if it contains only valid base32 characters
    const base32Regex = /^[A-Z2-7]+$/;
    
    // Must be at least 16 characters and multiple of 8 (after padding)
    return base32Regex.test(cleanSecret) && cleanSecret.length >= 16;
}

/**
 * Get remaining time in current TOTP window
 * @param {number} timeStep - Time step in seconds (default: 30)
 * @returns {number} - Remaining seconds
 */
function getRemainingTime(timeStep = 30) {
    const now = Math.floor(Date.now() / 1000);
    return timeStep - (now % timeStep);
}

/**
 * Generate multiple TOTP codes (current, previous, next)
 * Useful for validation with clock skew tolerance
 * @param {string} secret - Base32 encoded secret key
 * @returns {Promise<Object>} - Object with previous, current, next codes
 */
async function generateTOTPWindow(secret) {
    try {
        const [previous, current, next] = await Promise.all([
            generateTOTP(secret, -1),
            generateTOTP(secret, 0),
            generateTOTP(secret, 1)
        ]);
        
        return { previous, current, next };
    } catch (error) {
        console.error('TOTP window generation error:', error);
        throw error;
    }
}

/**
 * Format secret key for display (add spaces every 4 characters)
 * @param {string} secret - Secret key
 * @returns {string} - Formatted secret key
 */
function formatSecretKey(secret) {
    return secret.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
}

/**
 * Check if browser supports required APIs
 * @returns {boolean} - True if supported
 */
function isSupported() {
    return !!(window.crypto && window.crypto.subtle && window.crypto.subtle.importKey);
}

// Export functions for use in other scripts
window.TOTPGenerator = {
    generate: generateTOTP,
    validate: validateSecretKey,
    getRemainingTime: getRemainingTime,
    generateWindow: generateTOTPWindow,
    formatSecret: formatSecretKey,
    isSupported: isSupported
};