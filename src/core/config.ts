/**
 * Чтение и валидация переменных окружения через dotenv.
 * Вызов dotenv.config() гарантирует загрузку значений из .env в process.env.
 */
import dotenv from "dotenv";

dotenv.config(); // загружаем .env

/**
 * Централизованный объект конфигурации.
 * Здесь можно указывать дефолтные значения и валидировать необходимые переменные.
 */
export const config = {
  appName: process.env.APP_NAME || "dtrader-crypto-3",
  version: process.env.APP_VERSION || "0.1.0",

  // В следующих полях предполагаем, что ключи обязательны
  gateApiKey: process.env.GATE_API_KEY as string,
  gateSecretKey: process.env.GATE_SECRET_KEY as string,

  // Пример дополнительной переменной
  logLevel:
    (process.env.LOG_LEVEL as "debug" | "info" | "warn" | "error") || "info",
};
