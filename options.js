const keyEl = document.getElementById("key");
const statusEl = document.getElementById("status");

chrome.storage.local.get(["openaiApiKey"], (res) => {
    if (res.openaiApiKey) keyEl.value = res.openaiApiKey;
});

document.getElementById("save").onclick = () => {
    const key = keyEl.value.trim();
    chrome.storage.local.set({ openaiApiKey: key }, () => {
        statusEl.textContent = "Saved.";
    });
};

document.getElementById("clear").onclick = () => {
    chrome.storage.local.remove(["openaiApiKey"], () => {
        keyEl.value = "";
        statusEl.textContent = "Cleared.";
    });
};
