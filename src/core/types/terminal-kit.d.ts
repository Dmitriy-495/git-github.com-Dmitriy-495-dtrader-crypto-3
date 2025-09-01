/**
 * Локальная декларация модуля 'terminal-kit', чтобы TypeScript знал о нём.
 * Используем any, чтобы снять ошибку TS7016 (нет типов).
 * При желании можно постепенно уточнять типы по мере использования.
 */
declare module "terminal-kit" {
  // 'terminal-kit' экспортирует объект (CommonJS). Благодаря esModuleInterop можно импортировать как default.
  const termkit: any;
  export = termkit;
}
