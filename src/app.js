const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const appConfig = require("./config/appConfig");
const routes = require("./routes");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(helmet());
app.use(cors({ origin: appConfig.corsOrigin }));
app.use(express.json({ limit: appConfig.jsonLimit }));
app.use(express.urlencoded({ extended: true }));

app.use("/vendor/bootstrap", express.static(appConfig.bootstrapPath));
app.use(express.static(appConfig.publicPath));

app.use("/api", routes);

app.get("/", (req, res) => {
  res.sendFile("login.html", { root: appConfig.publicPath });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    environment: appConfig.env,
  });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
