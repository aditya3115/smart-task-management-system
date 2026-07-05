const path = require("path");

const DEFAULT_PORT = 5000;
const DEFAULT_PORT_RETRY_MAX = 10;

const parsePort = (value, fallback) => {
  if (typeof value !== "undefined" && value !== null && value !== "") {
    const port = Number(value);
    if (Number.isInteger(port) && port >= 0 && port <= 65535) {
      return port;
    }
    console.warn(`Invalid PORT value '${value}' detected. Falling back to ${fallback}.`);
  }
  return fallback;
};

const appConfig = {
  env: process.env.NODE_ENV || "development",
  port: parsePort(process.env.PORT, DEFAULT_PORT),
  portRetryMax: parsePort(process.env.PORT_RETRY_MAX, DEFAULT_PORT_RETRY_MAX),
  publicPath: path.join(__dirname, "../../public"),
  bootstrapPath: path.join(__dirname, "../../node_modules/bootstrap/dist"),
  corsOrigin: process.env.CORS_ORIGIN || "*",
  jsonLimit: process.env.JSON_LIMIT || "1mb",
};

module.exports = appConfig;
