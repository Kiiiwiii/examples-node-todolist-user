import { Request, Response, NextFunction } from 'express';
import fs from 'fs';

export default function(name: string) {
  return function (req: Request, _res: Response, next: NextFunction) {
    const date = new Date().toString();
    const url = req.url;
    const method = req.method;
    fs.appendFile(name, `${date}, use method: ${method}, access url: ${url}. \n`, (err) => {
      if(err) {
        console.log(err);
      }
    });
    next();
  };
}