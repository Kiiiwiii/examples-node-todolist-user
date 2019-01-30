import {startConfigProcess} from './config/config';

startConfigProcess().then(() => {
  async function runServer() {
    const express = await import('express');
    const log = await import('./log');
    const bodyParser = await import('body-parser');
    const apiRouter = await import('./router-middleware/api');
    await import('./db/mongodb-connect');

    const app = express.default();
    const port = process.env.PORT || 3000;
    // app level middleware
    app.use(log.default(__dirname + '/../log', 'app-log.txt'));

    // static file
    app.use('/static', express.static(__dirname + '/../client/public'));

    // router middleware - api data
    app.use(bodyParser.default.json());
    app.use('/api', apiRouter.default);

    // root - single page application - entry point
    app.get('*', (req: any, res: any) => {
      res.sendFile('index.html', {
        root: __dirname + '/../client',
      });
    });

    // tslint:disable-next-line:no-console
    app.listen(port, () => console.log(`http://zhan.com:${port}`));
  }
  runServer();
});

// import express from 'express';
// import log from './log';
// import bodyParser from 'body-parser';
// import apiRouter from './router-middleware/api';
// import './db/mongodb-connect';
