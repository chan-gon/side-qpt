/**
 * Background service worker for SideQPT
 * Handles context menu, message routing and OpenAI API calls
 */

// Create right-click context menu
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "SIDE_QPT",
        title: "Ask SideQPT",
        contexts: ["selection"],
    });
});

// Handle context menu click - open popup programmatically
// Note: In MV3, we can't directly open popup from context menu,
// so we store the selection and let popup fetch it
let lastContextMenuSelection = "";

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId !== "SIDE_QPT") return;

    let text = info.selectionText?.trim() || "";

    if (!text && tab?.id) {
        text = await getSelectionFromContent(tab.id);
    }

    lastContextMenuSelection = text;

    // Open the popup by simulating action click (MV3 limitation workaround)
    // Users will see the popup with the selected text
    chrome.action.openPopup();
});

// Get selection from content script
function getSelectionFromContent(tabId) {
    return new Promise((resolve) => {
        chrome.tabs.sendMessage(
            tabId,
            { type: "CS_GET_SELECTION" },
            (res) => resolve(res?.text || "")
        );
    });
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    // Handle ask question request
    if (msg.type === "POPUP_ASK" || msg.type === "SIDEQPT_ASK") {
        (async () => {
            const apiKey = await getApiKey();
            if (!apiKey) {
                sendResponse({ error: "Missing API key. Open Settings and save your OpenAI API key." });
                return;
            }

            try {
                const answer = await callOpenAI({
                    apiKey,
                    contextText: msg.contextText || "",
                    question: msg.question || "",
                });
                sendResponse({ answer });
            } catch (e) {
                sendResponse({ error: e?.message || "Request failed." });
            }
        })();

        return true; // async response
    }

    // Get last context menu selection (if any)
    if (msg.type === "GET_CONTEXT_MENU_SELECTION") {
        const text = lastContextMenuSelection;
        lastContextMenuSelection = ""; // Clear after reading
        sendResponse({ text });
        return;
    }
});

import { decryptApiKey, isKeyExpired } from './crypto-utils.js';

async function getApiKey() {
    // 1. Try session storage first (fastest)
    const sessionFn = () => new Promise(resolve => chrome.storage.session.get(['apiKey'], res => resolve(res.apiKey)));
    const sessionKey = await sessionFn();
    if (sessionKey) return sessionKey;

    // 2. Try local storage (encrypted)
    return new Promise((resolve) => {
        chrome.storage.local.get(["encryptedApiKey"], async (res) => {
            if (!res.encryptedApiKey) {
                resolve("");
                return;
            }

            // 3. Check expiry
            if (isKeyExpired(res.encryptedApiKey.timestamp)) {
                await chrome.storage.local.remove("encryptedApiKey");
                resolve("");
                return;
            }

            // 4. Decrypt
            const decrypted = await decryptApiKey(res.encryptedApiKey);

            if (decrypted) {
                // 5. Cache in session
                await chrome.storage.session.set({ apiKey: decrypted });
            }

            resolve(decrypted || "");
        });
    });
}

async function callOpenAI({ apiKey, contextText, question }) {
    const input = `Context:\n${contextText}\n\nQuestion:\n${question}`;

    const resp = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "gpt-4.1-mini",
            input,
        }),
    });

    if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`HTTP ${resp.status}: ${text}`);
    }

    const data = await resp.json();
    const answer = extractTextFromResponses(data);
    return answer.trim();
}

function extractTextFromResponses(data) {
    const out = data?.output || [];
    let text = "";

    for (const item of out) {
        const content = item?.content || [];
        for (const c of content) {
            if (c?.type === "output_text" && typeof c.text === "string") {
                text += c.text;
            }
        }
    }

    return text || "";
}