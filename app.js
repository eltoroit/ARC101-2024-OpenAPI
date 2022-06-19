const logger = require('morgan');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const express = require('express');
const swaggerUI = require("swagger-ui-express");
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const swaggerJsDoc = require("swagger-jsdoc")({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Quotes API",
      version: "1.0.0",
      description: "A simple Express Library API",
    },
    servers: [
      { url: "http://localhost:3000" },
      { url: "https://et-demo-arc101-002.herokuapp.com" },
    ],
  },
  apis: ["./routes/*.js"],
});

app.use('/', require('./routes/index'));
app.use('/quotes', require('./routes/quotes'));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc));
app.get('/api-docs.json', (req, res, next) => {
  res.json(swaggerJsDoc);
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;