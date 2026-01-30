<p align="center">
  <img src="assets/icon128.png" alt="SideQPT Icon" width="128" height="128">
</p>

<h1 align="center">SideQPT</h1>

<p align="center">
  <strong>AI-powered text assistant for your browser</strong><br>
  Ask questions about selected text and get instant answers
</p>

---

## Overview

SideQPT is a lightweight Chrome extension that allows you to quickly ask AI-powered questions about any selected text on a webpage. Simply highlight text, press a keyboard shortcut or right-click, and get responses powered by OpenAI.

### Key Features

- 🚀 **Quick Access**: Use `Alt+S` keyboard shortcut or right-click context menu
- 💬 **ChatGPT-style UI**: Modern, clean input interface
- ⚙️ **Built-in Settings**: Configure API key directly in the popup
- 🔒 **Privacy-focused**: Your API key is stored locally

## Project Structure

```
sideq-extension/
├── manifest.json      # Extension configuration
├── popup.html         # Main popup UI
├── popup.js           # Popup logic and API calls
├── background.js      # Service worker for context menu
├── content.js         # Content script for text selection
├── options.html       # Settings page (legacy)
├── options.js         # Settings logic (legacy)
└── assets/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
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
   - Press `Alt+S` (keyboard shortcut)
   - Right-click and select "Ask SideQPT"
   - Click the extension icon
3. **Type your question** in the input field
4. Press **Enter** or click the send button

---

## 개요 (한국어)

SideQPT는 웹페이지에서 선택한 텍스트에 대해 AI 기반 질문을 빠르게 할 수 있는 경량 Chrome 확장 프로그램입니다. 텍스트를 드래그하고, 단축키를 누르거나 우클릭하면 OpenAI를 통해 즉각적인 답변을 받을 수 있습니다.

### 주요 기능

- 🚀 **빠른 접근**: `Alt+S` 단축키 또는 우클릭 컨텍스트 메뉴
- 💬 **ChatGPT 스타일 UI**: 현대적이고 깔끔한 입력 인터페이스
- ⚙️ **내장 설정**: 팝업에서 직접 API 키 설정 가능
- 🔒 **프라이버시 중심**: API 키는 로컬에만 저장

## 프로젝트 구조

```
sideq-extension/
├── manifest.json      # 확장 프로그램 설정
├── popup.html         # 메인 팝업 UI
├── popup.js           # 팝업 로직 및 API 호출
├── background.js      # 컨텍스트 메뉴용 서비스 워커
├── content.js         # 텍스트 선택용 콘텐츠 스크립트
├── options.html       # 설정 페이지 (레거시)
├── options.js         # 설정 로직 (레거시)
└── assets/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
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
2. 다음 중 하나의 방법으로 **SideQPT를 엽니다**:
   - `Alt+S` (키보드 단축키)
   - 우클릭 후 "Ask SideQPT" 선택
   - 확장 프로그램 아이콘 클릭
3. 입력창에 **질문을 입력**합니다
4. **Enter**를 누르거나 전송 버튼을 클릭합니다

---

## Roadmap / 개발 계획

### Current Status / 현재 상태

- ✅ OpenAI API integration (GPT-4.1 Mini)
- ✅ Text selection and context menu
- ✅ Keyboard shortcut support
- ✅ ChatGPT-style popup UI

### Planned Features / 계획된 기능

> 🔮 **Multi-Provider API Support**
>
> Currently, SideQPT only supports OpenAI API. In future updates, we plan to integrate multiple AI service providers to give users more flexibility and choice:
>
> - **Google Gemini API**
> - **Anthropic Claude API**

> 🔮 **다중 API 지원 계획**
>
> 현재 SideQPT는 OpenAI API만 지원합니다. 향후 업데이트에서 사용자에게 더 많은 유연성과 선택권을 제공하기 위해 여러 AI 서비스 제공업체를 통합할 계획입니다:
>
> - **Google Gemini API**
> - **Anthropic Claude API**

---

## License

MIT License - feel free to use and modify.
