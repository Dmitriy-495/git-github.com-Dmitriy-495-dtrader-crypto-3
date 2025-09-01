// src/test/eventbus.terminal.test.cjs
const termkit = require("terminal-kit");
const term = termkit.terminal;

const { EventBus } = require("../core/event-bus");
const { config } = require("../core/config");

// подготовка терминала
term.clear();
term.hideCursor();
term.bold.cyan("▶ Запуск теста EventBus с terminal-kit (CJS)\n\n");

const bus = new EventBus({ logAll: false });
const received = [];

// спиннер
const spinner = term.spinner({ text: "Ожидание событий..." });
spinner.start();

bus.on("bus:message", (payload) => {
  spinner.stop();
  term.green.bold("\n✔ bus:message получено:\n");
  term.white(`${JSON.stringify(payload, null, 2)}\n`);
  received.push({ event: "bus:message", payload });
  spinner.start();
});

bus.on("log", (payload) => {
  spinner.stop();
  term.green.bold("\n✔ log получено:\n");
  term.white(`${JSON.stringify(payload, null, 2)}\n`);
  received.push({ event: "log", payload });
  spinner.start();
});

// симуляция событий
setTimeout(() => {
  bus.emit("bus:message", {
    channel: "test-channel",
    payload: { foo: 42 },
  });
}, 1000);

setTimeout(() => {
  bus.emit("log", {
    level: "info",
    message: "Test log via CJS",
    meta: { timestamp: Date.now() },
  });
}, 2000);

setTimeout(() => {
  spinner.stop();
  term.showCursor();
  term("\n");

  try {
    console.assert(
      received.length === 2,
      `Ожидали 2 события, получили ${received.length}`
    );
    console.assert(received[0].event === "bus:message");
    console.assert(received[1].event === "log");
  } catch (err) {
    term.red.bold(`\n✖ Ошибка теста: ${err.message}\n`);
    process.exit(1);
  }

  term.green.bold("\n🎉 Все проверки пройдены!\n");
  process.exit(0);
}, 3000);
