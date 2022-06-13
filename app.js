const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const xss = require("xss-clean");
const AppError = require("./errorHandling/AppError");
const errorController = require("./errorHandling/errorController");
const fs = require("fs");

// READ JSON FILE
const data = JSON.parse(fs.readFileSync(`./data.json`, "utf8"));

const golobalRouter = express.Router();
golobalRouter.get("/getData", (req, res, next) => {
  res.json({
    status: "success",
    data,
  });
});

const app = express();
app.use(helmet());
app.use(morgan("dev"));
// data sanitization againt XSS
app.use(xss());

// ROUTES
app.use("/api/v1", golobalRouter);

app.all("*", function (req, res, next) {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server`, 404)
  );
});

app.use(errorController);

module.exports = app;
