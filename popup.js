/**
 * Popup script for SideQPT
 * Handles selection display, question submission, and settings
 */

const contextEl = document.getElementById("context");
const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const askBtn = document.getElementById("ask");
const settingsToggle = document.getElementById("settingsToggle");
const settingsPanel = document.getElementById("settingsPanel");
const apiKeyInput = document.getElementById("apiKey");
const saveApiKeyBtn = document.getElementById("saveApiKey");
const saveMsg = document.getElementById("saveMsg");

let contextText = "";

// Get selected text from active tab
async function getSelection() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab?.id) {
            showNoSelection();
            return;
        }

        // Check if we can inject content script (some pages like chrome:// don't allow it)
        if (tab.url?.startsWith("chrome://") || tab.url?.startsWith("chrome-extension://")) {
            showNoSelection("Cannot access this page");
            return;
        }

        // Try to get selection via content script
        try {
            const response = await chrome.tabs.sendMessage(tab.id, { type: "CS_GET_SELECTION" });
            contextText = response?.text || "";
        } catch (e) {
            // Content script might not be injected yet, try to inject it
            try {
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: () => window.getSelection()?.toString().trim() || ""
                }).then((results) => {
                    contextText = results?.[0]?.result || "";
                });
            } catch (scriptError) {
                console.log("Cannot inject script:", scriptError);
                showNoSelection();
                return;
            }
        }

        if (contextText) {
            contextEl.textContent = contextText;
            contextEl.classList.remove("empty");
        } else {
            showNoSelection();
        }
    } catch (e) {
        console.error("Error getting selection:", e);
        showNoSelection();
    }
}

function showNoSelection(msg = "No text selected") {
    contextEl.textContent = `(${msg})`;
    contextEl.classList.add("empty");
}

// Initialize
getSelection();
loadApiKey();

// Settings toggle
settingsToggle.onclick = () => {
    settingsPanel.classList.toggle("visible");
    settingsToggle.classList.toggle("active");
};

// Load existing API key
async function loadApiKey() {
    const result = await chrome.storage.local.get(["openaiApiKey"]);
    if (result.openaiApiKey) {
        apiKeyInput.value = result.openaiApiKey;
    }
}

// Save API key
saveApiKeyBtn.onclick = async () => {
    const key = apiKeyInput.value.trim();
    await chrome.storage.local.set({ openaiApiKey: key });

    // Show saved message
    saveMsg.classList.add("show");
    setTimeout(() => {
        saveMsg.classList.remove("show");
    }, 2000);
};

// Auto-resize textarea as user types
function autoResize() {
    questionEl.style.height = 'auto';
    questionEl.style.height = Math.min(questionEl.scrollHeight, 100) + 'px';
}

questionEl.addEventListener('input', autoResize);

// Submit question function
function submitQuestion() {
    const question = questionEl.value.trim();
    if (!question) return;

    askBtn.disabled = true;
    answerEl.classList.remove("hidden");
    answerEl.classList.add("loading");
    answerEl.textContent = "Thinking...";

    chrome.runtime.sendMessage(
        { type: "POPUP_ASK", contextText, question },
        (res) => {
            askBtn.disabled = false;
            answerEl.classList.remove("loading");

            if (!res) {
                answerEl.textContent = "No response.";
                return;
            }
            if (res.error) {
                answerEl.textContent = getErrorMessage(res.error);
                return;
            }
            answerEl.textContent = res.answer || "(No answer received)";
        }
    );
}

// Retrieve user-friendly error message
function getErrorMessage(error) {
    if (typeof error !== "string") {
        return "Something went wrong. Please try again.";
    }

    // 인증 오류 (API Key 문제)
    if (error.includes("HTTP 401") || error.includes("invalid_api_key")) {
        return "Authentication failed. Please check your API key.";
    }

    // 요청 제한
    if (error.includes("HTTP 429")) {
        return "Too many requests. Please wait a moment and try again.";
    }

    // 네트워크 / 서버 문제
    if (error.includes("Network") || error.includes("fetch")) {
        return "Network error. Please check your internet connection.";
    }

    // 그 외
    return "Unexpected error occurred. Please try again later.";
}

// Click handler for submit button
askBtn.onclick = submitQuestion;

// Enter key to submit (Shift+Enter for new line)
questionEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submitQuestion();
    }
});
