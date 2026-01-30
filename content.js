/**
 * a selection retrieval handler
 * 선택된 텍스트 하나만 반환
 */

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "CS_GET_SELECTION") {
        sendResponse({ text: window.getSelection()?.toString().trim() || "" });
    }
});