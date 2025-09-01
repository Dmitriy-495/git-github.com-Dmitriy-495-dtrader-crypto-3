/**
 * Карта событий приложения.
 * Ключ — строковое имя события, значение — тип полезной нагрузки.
 *
 * Индексная сигнатура делает интерфейс совместимым с Record<string, unknown>,
 * что позволяет использовать его в обобщённом EventBus без ошибок TS2344.
 */
export interface AppEvents {
  // Индексная сигнатура для совместимости с Record<string, unknown>.
  [event: string]: unknown;

  // Старт приложения
  "app:start": { version: string; name: string };

  // Готовность терминала и его размеры
  "terminal:ready": { columns: number; rows: number };

  // Сообщение по внутренней шине
  "bus:message": { channel: string; payload: unknown };

  // Событие логирования
  log: {
    level: "debug" | "info" | "warn" | "error";
    message: string;
    meta?: Record<string, unknown>;
  };
}
