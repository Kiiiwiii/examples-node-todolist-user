import { body, query, param } from 'express-validator/check';
import validator from 'validator';
import Operation from '../db/mongoose.operation';
import User from '../db/schema/user.schema';
import express from 'express';
import { validationHandler } from './validation.ultili';
import { matchedData } from 'express-validator/filter';

// validation middleware
// powered by express validator
const validation = {
  addUser: [
    body('email', 'Email is required and should comply with a proper format')
      .exists()
      .custom((value) => validator.isEmail(value)),
    body('password', 'password is required')
      .exists(),
  ]
}

const dbOperation = new Operation(User);
const router = express.Router();

router.use('/addUser', validation['addUser'], validationHandler, (req: any, res: any) => {
  const data: any = matchedData(req, {locations: ['body']})
  dbOperation.addItem(data).then(result => {
    res.status(200).send(result);
  }).catch(err => {
    res.status(400).send(err);
  });
});

export default router;