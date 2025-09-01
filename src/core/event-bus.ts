/**
 * Тип обработчика: принимает полезную нагрузку типа Payload.
 */
type Handler<Payload> = (payload: Payload) => void;

/**
 * Лёгкий синхронный EventBus с сильной типизацией по EvtMap.
 * - EvtMap — карта событий: { 'event:name': PayloadType; ... }
 * - on/emit типобезопасны: при неверной нагрузке компилятор ругается.
 * - on возвращает функцию отписки.
 */
export class EventBus<EvtMap extends Record<string, unknown>> {
  // Для каждого события храним множество обработчиков
  private listeners = new Map<keyof EvtMap, Set<Handler<any>>>();

  constructor(
    // Опция для демонстрации: логировать все публикации событий
    private readonly options: { logAll?: boolean } = { logAll: true }
  ) {}

  /**
   * Подписка на конкретное событие.
   * Возвращает функцию для отписки.
   */
  on<K extends keyof EvtMap>(
    event: K,
    handler: Handler<EvtMap[K]>
  ): () => void {
    const set = this.listeners.get(event) ?? new Set<Handler<any>>();
    // Приведение типов нужно из-за общей Set<Handler<any>>
    set.add(handler as Handler<any>);
    this.listeners.set(event, set);
    return () => {
      set.delete(handler as Handler<any>);
      if (set.size === 0) this.listeners.delete(event);
    };
  }

  /**
   * Публикация события: синхронно вызывает всех подписчиков.
   */
  emit<K extends keyof EvtMap>(event: K, payload: EvtMap[K]): void {
    if (this.options.logAll) {
      const ts = new Date().toISOString();
      console.log(`[${ts}] [bus] ${String(event)} ${JSON.stringify(payload)}`);
    }
    const set = this.listeners.get(event);
    if (!set) return;
    for (const handler of set) handler(payload);
  }
}
