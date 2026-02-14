import { encryptApiKey, decryptApiKey, isKeyExpired } from './crypto-utils.js';

const keyEl = document.getElementById("key");
const statusEl = document.getElementById("status");

// Load existing key
(async () => {
    // Try session first
    const sessionFn = () => new Promise(resolve => chrome.storage.session.get(['apiKey'], res => resolve(res.apiKey)));
    const sessionKey = await sessionFn();

    if (sessionKey) {
        keyEl.value = sessionKey;
        return;
    }

    // Fallback to local
    chrome.storage.local.get(["encryptedApiKey"], async (res) => {
        if (res.encryptedApiKey && !isKeyExpired(res.encryptedApiKey.timestamp)) {
            try {
                const decrypted = await decryptApiKey(res.encryptedApiKey);
                if (decrypted) keyEl.value = decrypted;
            } catch (e) {
                console.error("Failed to decrypt", e);
            }
        }
    });
})();

document.getElementById("save").onclick = async () => {
    const key = keyEl.value.trim();

    if (!key) {
        statusEl.textContent = "Please enter an API key.";
        return;
    }

    if (!key.startsWith("sk-")) {
        statusEl.textContent = "Invalid key format (must start with sk-)";
        return;
    }

    try {
        const encrypted = await encryptApiKey(key);
        await chrome.storage.local.set({ encryptedApiKey: encrypted });
        await chrome.storage.session.set({ apiKey: key });

        // Cleanup old
        await chrome.storage.local.remove(["openaiApiKey"]);

        statusEl.textContent = "Saved securely.";
    } catch (e) {
        statusEl.textContent = "Error saving key.";
        console.error(e);
    }
};

document.getElementById("clear").onclick = async () => {
    await chrome.storage.local.remove(["encryptedApiKey", "openaiApiKey"]);
    await chrome.storage.session.remove(["apiKey"]);
    keyEl.value = "";
    statusEl.textContent = "Cleared.";
};
