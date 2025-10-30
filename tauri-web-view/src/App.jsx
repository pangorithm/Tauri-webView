import { createSignal } from "solid-js";
import logo from "./assets/logo.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { openUrl } from "@tauri-apps/plugin-opener";

function App() {
  const [greetMsg, setGreetMsg] = createSignal("");
  const [name, setName] = createSignal("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name: name() }));
  }

  async function openExternalTauriWindow() {
    const webview = new WebviewWindow("my-label", {
      url: "https://google.com",
      title: "Google",
      width: 800,
      height: 600,
    });
    webview.once("tauri://created", function () {
      // webview successfully created
    });
    webview.once("tauri://error", function (e) {
      // an error happened creating the webview
    });
  }

  // 사용자의 기본 브라우저로 외부 웹페이지를 여는 함수
  async function openInDefaultBrowser() {
    await openUrl("https://tauri.app"); // 열고 싶은 외부 URL
  }

  return (
    <main class="container">
      <h1>Welcome to Tauri + Solid</h1>

      <div class="row">
        <a href="https://vite.dev" target="_blank">
          <img src="/vite.svg" class="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" class="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://solidjs.com" target="_blank">
          <img src={logo} class="logo solid" alt="Solid logo" />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and Solid logos to learn more.</p>

      <form
        class="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg()}</p>

      <div class="row" style={{ "margin-top": "2rem" }}>
        <button onClick={openExternalTauriWindow}>새 Tauri 창으로 Google 열기</button>
        <button onClick={openInDefaultBrowser} style={{ "margin-left": "1rem" }}>
          기본 브라우저로 Tauri 공식 문서 열기
        </button>
      </div>
    </main>
  );
}

export default App;
