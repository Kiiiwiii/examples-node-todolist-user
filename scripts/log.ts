import { Request, Response, NextFunction } from 'express';
import fs from 'fs';

export default function(path: string, name: string) {
  return function (req: Request, _res: Response, next: NextFunction) {
    const date = new Date().toString();
    const url = req.url;
    const method = req.method;
    function checkAndAppendFile() {
      fs.appendFile(`${path}/${name}`, `${date}, use method: ${method}, access url: ${url}. \n`, (err) => {
        if (err) {
          fs.mkdir(`${path}`, { recursive: true }, (err) => {
            if (err) throw err;
            checkAndAppendFile();
          });
        }
        next();
      });
    }
    checkAndAppendFile();
  };
}