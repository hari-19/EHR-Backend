import createError from 'http-errors';
import express from 'express';
// import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import indexRouter from './routes/index';
import patientRouter from './routes/patientRouter';
import doctorRouter from './routes/doctorRouter';
import { ValidationError } from 'express-validation';

const app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/patient', patientRouter);
app.use('/doctor', doctorRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req: any, res: any, next: any) => {
  next(createError(404));
});

// error handler
app.use((err: any, req: any, res: any, next: any) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err)
  }

  // render the error page
  res.status(err.status || 500);
  res.json({
    error: err.message
  });
});

export default app;
