import express from 'express';
import { body, query, param } from 'express-validator/check';
import { sanitizeQuery, matchedData } from 'express-validator/filter';

import Operation from '../db/mongoose.operation';
import Todo from '../db/schema/todo.schema';
import {validationHandler} from './validation.ultili';


// validation middleware
// powered by express validator
const validation = {
  addItem: [
    body('text', 'Text is required').exists(),
    body('isCompleted', 'isCompleted should be a boolean value')
      .optional()
      .custom((value) => value === 'true' || value === 'false'),
    body('completedAt', 'completedAt should be a timestamp number').optional().isInt()
  ],
  lists: [
    query('text').optional(),
    query('isCompleted', 'isCompleted should be a boolean value')
      .optional()
      .custom((value) => value === 'true' || value === 'false'),
    sanitizeQuery('isCompleted').toBoolean(),
    sanitizeQuery('text').customSanitizer(value => {
      return new RegExp(value, "i");
    })
    // we can also query some todos which completed before a timestamp
  ],
  item: [
    param('id', 'id is required').exists()
  ]
}

const dbOperation = new Operation(Todo);
// router logic
const router = express.Router();

router.use('/addItem', validation['addItem'], validationHandler, (req: any, res: any) => {

  dbOperation.addItem(req.body).then(result => {
    res.status(200).send(result);
  }).catch(err => console.error(err));

});

router.get('/lists', validation['lists'], validationHandler, (req: any, res: any) => {

  // extract only defined query data in the validation lists.
  const queryData = matchedData(req, {locations: ['query']});

  dbOperation.lists(queryData).then(result => {
    res.status(200).send(result);
  }).catch(err => console.log(err));
});

router.get('/item/:id', validation['item'], validationHandler, (req: any, res: any) => {
  const queryData = matchedData(req, {locations: ['params']});
  dbOperation.findItem(queryData.id).then(result => {
    // returns null when no data is matched
    if(!result){
      return Promise.reject('id is not valid');
    }
    res.status(200).send(result);
  }).catch(err => {
    res.send({
      data: null,
      errorMsg: 'id is not valid'
    })
    console.log(err);
  });
});

export default router;