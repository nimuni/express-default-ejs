const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require("cors")
const moment = require('moment-timezone');
const TIMEZONE = "Asia/Seoul";

const rootRouter = require('./routes/root');
const viewsRouter = require('./routes/views');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// logger settings
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
function logFilename() {
  return `${moment().tz(TIMEZONE).format("YYYYMMDD")}.log`;
}
const accessLogStream = rfs.createStream(logFilename, {
  interval: '1d',
  path: path.resolve(__dirname, 'logs'),
});
morgan.token('user', (req, res) => {
  return req.user ? req.user.id : "Guest"
  // return _.get(req, 'req.user.id') || 'Guest';
})
morgan.token('ip', (req, res) => {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress
})
morgan.token('date', (req, res) => {
  return moment().tz(TIMEZONE).format();
})
morgan.format('customFormat', '[:date][:method][:status][:response-time ms][url=:url][:ip][:user]');
app.use(morgan('customFormat', {
  stream: accessLogStream
}));
app.use(morgan('customFormat'));

// make db connection
const mongodb = require(process.cwd()+"/bin/db/mongodb")
mongodb.connectToServer(()=>{
  console.log("mongo db connected")
})

// router settings
app.use('/', rootRouter);
app.use('/views', viewsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
