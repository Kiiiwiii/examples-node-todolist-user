import express from 'express';
import { body, query, param } from 'express-validator/check';
import { sanitizeQuery, matchedData } from 'express-validator/filter';

import {Todo, Operation} from '../db/schema/todo.schema';
import {validationHandler} from './validation.ultili';

// validation middleware
// powered by express validator
const validation = {
  addItem: [
    body('text', 'Text is required').exists(),
    body('isCompleted', 'isCompleted should be a boolean value')
      .optional()
      .custom((value) => value === true || value === false),
    body('completedAt', 'completedAt should be a timestamp number').optional().isInt(),
  ],
  lists: [
    query('text').optional(),
    query('isCompleted', 'isCompleted should be a boolean value')
      .optional()
      .custom((value) => value === true || value === false),
    // * TAKE AWAY, modify the req field here is better
    sanitizeQuery('text').customSanitizer(value => {
      return new RegExp(value, 'i');
    }),
    // we can also query some todos which completed before a timestamp
  ],
  item: [
    param('id', 'id is required').exists(),
  ],
  updateItem: [
    param('id', 'id is required').exists(),
    body('text').optional(),
    body('isCompleted', 'isCompleted should be a boolean value')
      .optional().custom((value) => value === true || value === false),
  ],
};

const dbOperation = new Operation(Todo);
// router logic
const router = express.Router();

router.use('/addItem', validation['addItem'], validationHandler, (req: any, res: any) => {
  const data: any = { ...matchedData(req, { locations: ['body'], onlyValidData: true }),  _creator: req.user._id };

  dbOperation.addItem(data).then((result: any) => {
    res.status(200).send(result);
  }).catch((err: any) => console.error(err));

});

router.get('/lists', validation['lists'], validationHandler, (req: any, res: any) => {

  // extract only defined query data in the validation lists.
  const queryData = { ...matchedData(req, { locations: ['query'], onlyValidData: true }), _creator: req.user._id};

  dbOperation.lists(queryData).then(result => {
    res.status(200).send(result);
  }).catch(err => res.status(403).send(err));
});

router.get('/item/:id', validation['item'], validationHandler, (req: any, res: any) => {
  const queryData = matchedData(req, {locations: ['params'], onlyValidData: true});

  dbOperation.findItem(queryData.id, req.user._id).then(result => {
    // returns null when no data is matched
    if (!result) {
      return Promise.reject('id is not valid');
    }
    res.status(200).send(result);
  }).catch(err => {
    res.status(403).send({
      data: null,
      errorMsg: err,
    });
  });
});

router.delete('/:id', validation['item'], validationHandler, (req: any, res: any) => {
  const queryData = matchedData(req, { locations: ['params'], onlyValidData: true});
  dbOperation.deleteItem(queryData.id, req.user._id).then(result => {
    // returns null when no data is matched
    if (!result) {
      return Promise.reject('id is not valid');
    }
    res.status(200).send(result);
  }).catch(err => {
    res.status(403).send({
      data: null,
      errorMsg: err,
    });
  });
});

router.patch('/:id', validation['updateItem'], validationHandler, (req: any, res: any) => {
  const id = matchedData(req, {locations: ['params'], onlyValidData: true}).id;
  const update = matchedData(req, {locations: ['body'], onlyValidData: true});

  // complete logic
  if (update.isCompleted === true) {
    update.completedAt = new Date().getTime();
  } else if (update.isCompleted === false) {
    update.completedAt = null;
  }
  dbOperation.updateItem(id, update, req.user._id).then(result => {
    if (!result) {
      return Promise.reject('id is not valid');
    }
    res.status(200).send(result);
  }).catch(err => {
    res.status(403).send({
      data: null,
      errorMsg: err,
    });
  });
});

export default router;
