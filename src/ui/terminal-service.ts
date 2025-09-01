import termkit from "terminal-kit";
import type { EventBus } from "../core/event-bus.js";
import type { AppEvents } from "../core/types.js";

type Term = typeof termkit.terminal;

export class TerminalService {
  private term: Term = termkit.terminal;
  private unsubscribers: Array<() => void> = [];

  constructor(
    private readonly bus: EventBus<AppEvents>,
    private readonly options: { appName: string }
  ) {}

  async init(): Promise<void> {
    this.term.clear();
    this.term.hideCursor();
    this.term.grabInput({ mouse: "button" });

    // Сообщаем о готовности терминала
    this.bus.emit("terminal:ready", {
      columns: this.term.width,
      rows: this.term.height,
    });

    // Рендер приветствия
    this.renderWelcome();

    // Обработка клавиш
    this.term.on("key", (name: string) => {
      if (name === "CTRL_C" || name === "q") {
        this.bus.emit("log", {
          level: "info",
          message: "Shutdown requested by user",
        });
        this.shutdown(0);
      }
    });

    // Ресайз
    this.term.on("resize", () => {
      this.bus.emit("terminal:ready", {
        columns: this.term.width,
        rows: this.term.height,
      });
      this.renderStatus("Terminal resized");
    });

    // Пример подписки на сообщения шины — можно расширять
    this.unsubscribers.push(
      this.bus.on("bus:message", (msg) => {
        this.term("\n");
        this.term.dim(
          `channel: ${msg.channel} payload: ${JSON.stringify(msg.payload)}\n`
        );
      })
    );
  }

  private renderWelcome(): void {
    const { appName } = this.options;
    this.term.moveTo(1, 1);
    this.term.bold.cyan(`${appName}\n`);
    this.term.gray("Минимальный каркас запущен.\n");
    this.term.gray("Нажмите q или Ctrl+C для выхода.\n");
    this.term("\n");
  }

  private renderStatus(text: string): void {
    this.term("\n");
    this.term.yellow(`${text}\n`);
  }

  shutdown(code = 0): void {
    // Отписка
    for (const off of this.unsubscribers) off();
    this.unsubscribers = [];

    // Очистка терминала
    try {
      this.term.grabInput(false);
      this.term.showCursor();
      this.term("\n");
    } finally {
      // Корректное завершение процесса
      process.exit(code);
    }
  }
}
