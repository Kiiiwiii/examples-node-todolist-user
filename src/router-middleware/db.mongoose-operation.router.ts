import express from 'express';
import bodyParser from 'body-parser';
import { Model } from 'mongoose';
import Operation from '../db/mongoose.operation';

export default (model: Model<any>) =>{
  const operation = new Operation(model);
  const router = express.Router();
  router.use(bodyParser.json());

  router.use('/addItem', (req, res) => {
    operation.addItem(req.body).then(result => {
      res.status(200).send(result);
    }).catch(err => console.error(err));
  });
  return router;
};