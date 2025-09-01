import { config } from "./core/config";
import { EventBus } from "./core/event-bus";
import { AppEvents } from "./core/types";

// подключаем terminal-kit строго через require
// (документация рекомендует именно такой синтаксис)
const termkit = require("terminal-kit");
const terminal = termkit.terminal;

const bus = new EventBus<AppEvents>();

// стартовое событие
bus.on("app:start", ({ name, version }) => {
  console.log(
    `🚀 [${config.logLevel}] Приложение "${name}" v${version} запущено`
  );
});
bus.emit("app:start", {
  name: config.appName,
  version: config.version,
});

// очищаем экран и выводим приветствие
terminal.clear();
terminal.green("Hello from terminal-kit! 👋\n");

// событие готовности терминала
bus.on("terminal:ready", ({ columns, rows }) => {
  console.log(`🖥 Размер терминала: ${columns}×${rows}`);
});
bus.emit("terminal:ready", {
  columns: terminal.width,
  rows: terminal.height,
});

// демонстрация работы шины
bus.on("bus:message", ({ channel, payload }) => {
  console.log(`📨 [${channel}]`, payload);
});
bus.emit("bus:message", {
  channel: "system",
  payload: { ok: true },
});

// лог-событие
bus.on("log", ({ level, message, meta }) => {
  console[level](`[${level}] ${message}`, meta ?? "");
});
bus.emit("log", {
  level: "info",
  message: "Initialized",
  meta: {
    pid: process.pid,
    gateApiKey: config.gateApiKey ? "***" : "none",
  },
});
