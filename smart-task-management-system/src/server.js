require("dotenv").config();

const app = require("./app");
const appConfig = require("./config/appConfig");
const { pool, testConnection, ensureEventsTable } = require("./config/db");

let server;
let shuttingDown = false;

const shutdownGracefully = async (reason) => {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  console.log(`Shutting down server (${reason})...`);

  if (server && server.listening) {
    await new Promise((resolve) => server.close(resolve));
    console.log("HTTP server closed.");
  }

  if (pool) {
    try {
      await pool.end();
      console.log("Database connection pool closed.");
    } catch (error) {
      console.warn("Error closing database pool:", error.message);
    }
  }

  process.exit(0);
};

const registerShutdownHandlers = () => {
  process.on("SIGINT", () => shutdownGracefully("SIGINT"));
  process.on("SIGTERM", () => shutdownGracefully("SIGTERM"));
  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled rejection:", reason);
    shutdownGracefully("unhandledRejection");
  });
  process.on("uncaughtException", (error) => {
    console.error("Uncaught exception:", error);
    shutdownGracefully("uncaughtException");
  });
};

const startServer = async () => {
  await testConnection();
  try {
    await ensureEventsTable();
  } catch (error) {
    console.warn("Database schema check skipped:", error.message);
    console.warn("Import database/schema.sql to enable task and event features.");
  }
  registerShutdownHandlers();

  const basePort = appConfig.port;
  const maxPort = basePort === 0 ? 0 : basePort + appConfig.portRetryMax;
  let currentPort = basePort;

  const tryListen = () => {
    const candidatePort = currentPort;
    const candidateServer = app.listen(candidatePort, () => {
      server = candidateServer;
      const actualPort = server.address().port;
      console.log(`Smart Task Management System server running on port ${actualPort}`);
    });

    candidateServer.once("error", (error) => {
      if (error.code === "EADDRINUSE" && basePort !== 0 && currentPort < maxPort) {
        console.warn(`Port ${candidatePort} is already in use, trying port ${candidatePort + 1}...`);
        currentPort += 1;
        tryListen();
        return;
      }

      if (error.code === "EADDRINUSE") {
        const message = basePort === 0
          ? `Unable to bind ephemeral port. Please try again or set a specific PORT value.`
          : `Unable to start server: ports ${basePort}-${maxPort} are unavailable. Please free one of these ports or set PORT to a different value.`;
        console.error(message);
      } else if (error.code === "EACCES") {
        console.error(`Permission denied for port ${candidatePort}. Try a higher port or run with elevated privileges.`);
      } else {
        console.error("Server encountered an error:", error.message);
      }

      process.exit(1);
    });
  };

  tryListen();
};

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
