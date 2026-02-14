/**
 * Crypto utilities for SideQPT
 * Handles encryption/decryption of API keys using device fingerprint
 */

// Generate a device-specific key using browser fingerprint
async function getDeviceKey() {
    const fingerprint = [
        navigator.userAgent,
        navigator.language,
        new Date().getTimezoneOffset(),
        screen.colorDepth,
        screen.width + 'x' + screen.height
    ].join('|');

    const enc = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', enc.encode(fingerprint));
    return new Uint8Array(hashBuffer);
}

// Encrypt API key
export async function encryptApiKey(apiKey) {
    try {
        const deviceKey = await getDeviceKey();

        // Import device key for encryption
        const key = await crypto.subtle.importKey(
            "raw",
            deviceKey,
            { name: "AES-GCM", length: 256 },
            false,
            ["encrypt"]
        );

        const iv = crypto.getRandomValues(new Uint8Array(12));
        const enc = new TextEncoder();
        const encrypted = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            key,
            enc.encode(apiKey)
        );

        return {
            encrypted: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
            iv: btoa(String.fromCharCode(...iv)),
            timestamp: Date.now()
        };
    } catch (e) {
        console.error("Encryption failed:", e);
        throw e;
    }
}

// Decrypt API key
export async function decryptApiKey(encryptedData) {
    try {
        if (!encryptedData || !encryptedData.encrypted || !encryptedData.iv) {
            return null;
        }

        const deviceKey = await getDeviceKey();

        const key = await crypto.subtle.importKey(
            "raw",
            deviceKey,
            { name: "AES-GCM", length: 256 },
            false,
            ["decrypt"]
        );

        const encrypted = Uint8Array.from(atob(encryptedData.encrypted), c => c.charCodeAt(0));
        const iv = Uint8Array.from(atob(encryptedData.iv), c => c.charCodeAt(0));

        const decrypted = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv },
            key,
            encrypted
        );

        return new TextDecoder().decode(decrypted);
    } catch (e) {
        console.error("Decryption failed:", e);
        return null; // Return null if decryption fails (e.g. device changed)
    }
}

// Check if key is expired (30 days)
export function isKeyExpired(timestamp) {
    if (!timestamp) return true;
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    return (Date.now() - timestamp) > thirtyDays;
}