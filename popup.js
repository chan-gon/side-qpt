/**
 * Popup script for SideQPT
 * Handles selection display, question submission, and settings
 */

const contextEl = document.getElementById("context");
const questionEl = document.getElementById("question");
// Changed: Use answerTextEl for text to preserve close button
const answerEl = document.getElementById("answer");
const answerTextEl = document.getElementById("answerText");
const closeAnswerBtn = document.getElementById("closeAnswer");
const askBtn = document.getElementById("ask");
const settingsToggle = document.getElementById("settingsToggle");
const settingsPanel = document.getElementById("settingsPanel");
const apiKeyInput = document.getElementById("apiKey");
const saveApiKeyBtn = document.getElementById("saveApiKey");
const saveMsg = document.getElementById("saveMsg");

// History elements
const historyToggle = document.getElementById("historyToggle");
const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistory");

let contextText = "";
const statusHeader = document.getElementById("status-header");

// Get selected text from active tab
async function getSelection() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab?.id) {
            handleNoSelection();
            return;
        }

        // Check if we can inject content script (some pages like chrome:// don't allow it)
        if (tab.url?.startsWith("chrome://") || tab.url?.startsWith("chrome-extension://")) {
            handleNoSelection();
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
                handleNoSelection();
                return;
            }
        }

        if (contextText) {
            // Text selected
            statusHeader.textContent = "Selected Text";
            contextEl.textContent = contextText;
            contextEl.style.display = "block";
            contextEl.classList.remove("empty");
        } else {
            handleNoSelection();
        }
    } catch (e) {
        console.error("Error getting selection:", e);
        handleNoSelection();
    }
}

function handleNoSelection() {
    statusHeader.textContent = "Quick question";
    contextEl.style.display = "none";
}

// Initialize
getSelection();
loadApiKey();
loadHistory();

// Settings toggle
settingsToggle.onclick = () => {
    settingsPanel.classList.toggle("visible");
    settingsToggle.classList.toggle("active");
    // Close history if open
    if (historyPanel.classList.contains("visible")) {
        historyPanel.classList.remove("visible");
        historyToggle.classList.remove("active");
    }
};

// History toggle
historyToggle.onclick = () => {
    historyPanel.classList.toggle("visible");
    historyToggle.classList.toggle("active");
    // Close settings if open
    if (settingsPanel.classList.contains("visible")) {
        settingsPanel.classList.remove("visible");
        settingsToggle.classList.remove("active");
    }
};

// Clear history
clearHistoryBtn.onclick = async () => {
    if (confirm("Clear all history?")) {
        await chrome.storage.local.remove("qpt_history");
        loadHistory();
    }
};

// Close answer button
if (closeAnswerBtn) {
    closeAnswerBtn.onclick = () => {
        answerEl.classList.add("hidden");
        answerTextEl.textContent = ""; // specific cleanup
    };
}

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

// History Functions
async function saveHistory(question, answer) {
    try {
        const result = await chrome.storage.local.get(["qpt_history"]);
        let history = result.qpt_history || [];

        // Add new item
        const newItem = {
            id: Date.now(),
            question,
            answer,
            timestamp: new Date().toISOString()
        };

        // Add to beginning, keep max 50
        history.unshift(newItem);
        if (history.length > 50) history = history.slice(0, 50);

        await chrome.storage.local.set({ qpt_history: history });
        loadHistory(); // Refresh UI if open
    } catch (e) {
        console.error("Failed to save history:", e);
    }
}

async function loadHistory() {
    try {
        const result = await chrome.storage.local.get(["qpt_history"]);
        const history = result.qpt_history || [];
        renderHistory(history);
    } catch (e) {
        console.error("Failed to load history:", e);
    }
}

function renderHistory(history) {
    if (!history.length) {
        historyList.innerHTML = '<div class="loading" style="font-size: 12px; text-align: center; padding: 10px;">No history yet.</div>';
        return;
    }

    historyList.innerHTML = "";
    history.forEach(item => {
        const date = new Date(item.timestamp);
        const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        const el = document.createElement("div");
        el.className = "history-item";
        el.innerHTML = `
            <div class="q-text">${escapeHtml(item.question)}</div>
            <div class="a-preview">${escapeHtml(item.answer)}</div>
            <div class="timestamp">${timeStr}</div>
        `;

        // Click to view (simple implementation: put back in main view)
        el.onclick = () => {
            questionEl.value = item.question;
            answerEl.classList.remove("hidden");
            answerTextEl.textContent = item.answer;
            answerTextEl.classList.remove("loading");
        };

        historyList.appendChild(el);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

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
    answerTextEl.classList.add("loading");
    answerTextEl.textContent = "Thinking...";

    chrome.runtime.sendMessage(
        { type: "POPUP_ASK", contextText, question },
        (res) => {
            askBtn.disabled = false;
            answerTextEl.classList.remove("loading");

            if (!res) {
                answerTextEl.textContent = "No response.";
                return;
            }
            if (res.error) {
                answerTextEl.textContent = getErrorMessage(res.error);
                return;
            }

            const answer = res.answer || "(No answer received)";
            answerTextEl.textContent = answer;

            // Save to history
            saveHistory(question, answer);
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
