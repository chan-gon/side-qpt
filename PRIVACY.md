# Privacy Policy for SideQPT

**Last Updated:** February 14, 2026

## 1. Introduction
SideQPT ("we", "our", or "us") respects your privacy. This Privacy Policy explains how our Chrome extension handles your data.

## 2. Data Collection and Usage
**We do not collect, store, or transmit any personal data to our own servers.**

### User Input (Context Selection)
- When you use SideQPT, the text you select on a webpage is sent directly from your browser to the OpenAI API to generate a response.
- This data is **not** sent to or stored by us (the extension developers).

### API Keys
- Your OpenAI API Key is stored locally on your device using `chrome.storage.local`.
- It is encrypted using AES-GCM encryption before storage.
- It is never transmitted anywhere except directly to OpenAI's servers to authenticate your requests.

### History
- Your question and answer history is stored locally on your device (`chrome.storage.local`).
- You can clear this history at any time within the extension settings.

## 3. Third-Party Services
We use the **OpenAI API** to provide the core functionality of this extension.
- Your text and questions are sent to OpenAI.
- Please refer to [OpenAI's Privacy Policy](https://openai.com/privacy) for information on how they handle your data.

## 4. Changes to This Policy
We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.

## 5. Contact Us
If you have any questions about this Privacy Policy, please contact us via our GitHub repository.
