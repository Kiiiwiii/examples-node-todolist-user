import express from 'express';
import log from './log';
import dogRouter from './router-middleware/dogs';
import catRouter from './router-middleware/cats';

const app = express();

// app level middleware
app.use(log('app-log.txt'));

// static file
app.use('/static', express.static(__dirname + '/client/public'));

// router middleware - api data
app.use('/dog', dogRouter);
app.use('/cat', catRouter);

// root - single page application - entry point
app.get('*', (_req, res) => {
  res.sendFile('index.html', {
    root: __dirname + '/client'
  });
});

app.listen(3000, () => console.log('http://zhan.com:3000'));