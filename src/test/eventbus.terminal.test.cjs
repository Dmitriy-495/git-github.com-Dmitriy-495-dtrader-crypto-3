// src/test/eventbus.terminal.test.cjs

// 1) Подключаем ts-node, чтобы require мог подхватить .ts-файлы
require('ts-node').register({
  project: './tsconfig.json',
  transpileOnly: true,
  extensions: ['.ts']
});

// 2) Теперь можно require-ить ваши модули с .ts-расширением
const termkit = require('terminal-kit');
const term = termkit.terminal;

// важно:имена файлов в src/core — event-bus.ts и config.ts
const { EventBus } = require('../core/event-bus.ts');
const { config }   = require('../core/config.ts');

// 3) Подготовка терминала
term.clear();
term.hideCursor();
term.bold.cyan('▶ Запуск теста EventBus с terminal-kit\n\n');

const bus = new EventBus({ logAll: false });
const received = [];

// 4) Спиннер ожидания
const spinner = term.spinner({ text: 'Ожидание событий...' });
spinner.start();

// 5) Подписки на события
bus.on('bus:message', payload => {
  spinner.stop();
  term.green.bold('\n✔ bus:message получено:\n');
  term.white(`${JSON.stringify(payload, null, 2)}\n`);
  received.push({ event: 'bus:message', payload });
  spinner.start();
});

bus.on('log', payload => {
  spinner.stop();
  term.green.bold('\n✔ log получено:\n');
  term.white(`${JSON.stringify(payload, null, 2)}\n`);
  received.push({ event: 'log', payload });
  spinner.start();
});

// 6) Эмуляция событий с задержкой
setTimeout(() => {
  bus.emit('bus:message', {
    channel: 'test-channel',
    payload: { foo: 42 }
  });
}, 1000);

setTimeout(() => {
  bus.emit('log', {
    level: 'info',
    message: 'Test log via ts-node+CJS',
    meta: { timestamp: Date.now() }
  });
}, 2000);

// 7) Финальная проверка
setTimeout(() => {
  spinner.stop();
  term.showCursor();
  term('\n');

  try {
    console.assert(received.length === 2, `Ожидали 2 события, получили ${received.length}`);
    console.assert(received[0].event === 'bus:message', 'Первое событие — bus:message');
    console.assert(received[1].event === 'log', 'Второе событие — log');
  }
  catch (err) {
    term.red.bold(`\n✖ Ошибка теста: ${err.message}\n`);
    process.exit(1);
  }

  term.green.bold('\n🎉 Все проверки пройдены!\n');
  process.exit(0);
}, 3000);
