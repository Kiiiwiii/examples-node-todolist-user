import express from 'express';
import path from 'path';
import log from '../log';

const router = express.Router();
const animal = path.basename(__filename, path.extname(__filename))


router.use(log(`${animal}-log.txt`));

router.use('/home', (req, res) => {
  res.send(`${animal} home is here`);
});

router.use('/about', (req, res) => {
  res.send(`${animal} about is here`);
});

router.use('/', (req, res) => {
  res.send(`${animal} is here`);
});


export default router;