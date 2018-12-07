import express from 'express';
import log from './log';
import bodyParser from 'body-parser';
import apiRouter from './router-middleware/api';
// import './db/mongodb-connect';

const app = express();
const port = process.env.PORT || 3000;
// app level middleware
app.use(log('../log/app-log.txt'));

// static file
app.use('/static', express.static(__dirname + '/client/public'));

// router middleware - api data
app.use(bodyParser.json());
app.use('/api', apiRouter);

// root - single page application - entry point
app.get('*', (_req, res) => {
  res.sendFile('index.html', {
    root: __dirname + '/client'
  });
});

app.listen(port, () => console.log(`http://zhan.com:${port}`));