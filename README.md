<p align="center">
  <img src="assets/icon128.png" alt="SideQPT Icon" width="128" height="128">
</p>

<h1 align="center">SideQPT - Stay Curious, Stay on Page</h1>

<p>
  <strong>AI-powered text assistant for your browser</strong><br>
  Ask questions and get instant answers without bothering your main chat
</p>

---

## Overview

SideQPT is a lightweight Chrome extension that lets you ask questions and get AI answers immediately whenever curiosity strikes while you're browsing.

Feel free to just throw in a quick question.

When you're suddenly curious about something, you don't need to switch tabs or open a new chat window. You can open SideQPT right on the screen you're viewing to quickly ask your question and get an instant answer.

### Key Features

- 🚀 **Quick Access**: Use `Alt+S` keyboard shortcut or right-click context menu
- 📚 **History**: View and manage your past Q&A (last 50 items)
- ⚙️ **Built-in Settings**: Configure API key directly in the popup
- 🔒 **Secure Storage**: API key is encrypted (AES-GCM) and stored locally

## Security

1. **Encrypted**: We use AES-GCM encryption with a device-specific key.
2. **Local Only**: Stored only on your machine (chrome.storage.local).
3. **Direct Connection**: Requests go directly from your browser to OpenAI. No backend server exists in between.

## Project Structure

```
sideq-extension/
├── manifest.json      # Extension configuration
├── popup.html         # Main popup UI
├── popup.js           # Popup logic and API calls
├── background.js      # Service worker for API handling
├── content.js         # Content script for text selection
├── crypto-utils.js    # Encryption utilities (AES-GCM)
├── options.html       # Settings page
├── options.js         # Settings logic
└── assets/            # Icons
```

## Usage

### Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right)
4. Click **Load unpacked** and select the `sideq-extension` folder

### Setup

1. Click the SideQPT icon in your browser toolbar
2. Click **Settings** and enter your OpenAI API key
3. Click **Save**

### How to Use

1. **Select text** on any webpage
2. **Open SideQPT** using one of these methods:
   - Keyboard shortcuts
      - Windows: `Alt+S`
      - Mac: `Option+Shift+S`
   - 🖱️ Right-click and select "Ask SideQPT"
   - Click the extension icon
3. **Type your question** in the input field
4. Press **Enter** or click the send button

## Roadmap

### Current Status

- ✅ OpenAI API integration (GPT-4.1 Mini)
- ✅ Text selection and context menu
- ✅ Keyboard shortcut support
- ✅ Modern popup UI

### What we are planning now

> 🔮 **Multi-Provider API Support**
>
> Currently, SideQPT only supports OpenAI API. In future updates, we plan to integrate multiple AI service providers to give users more flexibility and choice:
>
> - **Google Gemini API**
> - **Anthropic Claude API**

---

## 개요 (한국어)

SideQPT는 웹페이지를 보다가 궁금한 부분이 생기면 바로 질문하고, AI 답변을 받을 수 있는 경량 Chrome 확장 프로그램입니다.

그냥 질문만 툭 던져도 괜찮습니다.

갑자기 궁금한 게 생겼을 때 굳이 다른 탭으로 이동하거나 새로운 채팅창을 생성하지 않아도, 지금 보고 있는 화면에서 바로 SideQPT를 열어 빠르게 질문하고 답변을 받을 수 있습니다.

### 주요 기능

- 🚀 **빠른 접근**: `Alt+S` 단축키 또는 🖱️ 우클릭 > "Ask SideQPT" 클릭
- 📚 **히스토리**: 과거 질문/답변 기록 보기 및 관리 (최근 50개)
- ⚙️ **내장 설정**: 팝업에서 직접 API 키 설정 가능
- 🔒 **보안 저장소**: API 키는 기기 고유 키로 암호화(AES-GCM)되어 로컬에 저장됩니다

## 프로젝트 구조

```
sideq-extension/
├── manifest.json      # 확장 프로그램 설정
├── popup.html         # 메인 팝업 UI
├── popup.js           # 팝업 로직 및 API 호출
├── background.js      # API 처리용 서비스 워커
├── content.js         # 텍스트 선택용 콘텐츠 스크립트
├── crypto-utils.js    # 암호화 유틸리티 (AES-GCM)
├── options.html       # 설정 페이지
├── options.js         # 설정 로직
└── assets/            # 아이콘 리소스
```

## 사용 방법

### 설치

1. 이 저장소를 클론하거나 다운로드합니다
2. Chrome에서 `chrome://extensions/`로 이동합니다
3. 우측 상단의 **개발자 모드**를 활성화합니다
4. **압축해제된 확장 프로그램을 로드합니다**를 클릭하고 `sideq-extension` 폴더를 선택합니다

### 설정

1. 브라우저 툴바에서 SideQPT 아이콘을 클릭합니다
2. **Settings**를 클릭하고 OpenAI API 키를 입력합니다
3. **Save**를 클릭합니다

### 사용법

1. 웹페이지에서 **텍스트를 선택**합니다
2. 다음 중 하나의 방법으로 **SideQPT를 실행할 수 있습니다**:
   - 키보드 단축키
      - Windows: `Alt+S`
      - Mac: `Option+Shift+S`
   - 우클릭 후 "Ask SideQPT" 선택
   - 확장 프로그램 아이콘 클릭
3. 입력창에 **질문을 입력**합니다
4. **Enter**를 누르거나 전송 버튼을 클릭합니다

---

## 개발 계획

### 현재 상태

- ✅ OpenAI API integration (GPT-4.1 Mini)
- ✅ Text selection and context menu
- ✅ Keyboard shortcut support
- ✅ Modern popup UI

### 준비중인 기능

> 🔮 **다중 API 지원 계획**
>
> 현재 SideQPT는 OpenAI API만 지원합니다. 향후 업데이트에서 사용자에게 더 많은 유연성과 선택권을 제공하기 위해 여러 AI 서비스 제공업체를 통합할 계획입니다:
>
> - **Google Gemini API**
> - **Anthropic Claude API**

## ⚠️ Important Notice / 주의사항

1. **Unofficial Product**: This extension is an independent open-source project and is **not** an official product of OpenAI.
2. **API Key Responsibility**: Users must provide their own OpenAI API Key.
3. **Billing**: Users are responsible for any costs incurred by OpenAI API usage. Please check your [OpenAI usage dashboard](https://platform.openai.com/account/usage) regularly.
4. **Local Storage**: Your API Key is stored locally on your device. While we encrypt it for security, please be aware of your local environment security.
5. **Key Expiration**: For enhanced security, your stored API Key will automatically expire after 30 days. You will need to re-enter it after this period.

---

## License

MIT License - feel free to use and modify.

## Privacy Policy

See [PRIVACY.md](PRIVACY.md) for details.
