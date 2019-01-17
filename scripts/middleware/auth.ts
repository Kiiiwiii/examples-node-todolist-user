import { User } from '../db/schema/user.schema';
import { UserModule } from 'type';

export default {
  authenticateUser(req: any, res: any, next: any) {
    const token = req.header('x-auth');

    (User as any).findByToken(token)
      .then((user: UserModule.UserModel) => {
        if (!user) {
          return Promise.reject({ error: 'user not found' });
        }

        // 1. TAKE AWAY - by modifying the req object, we can pass variables down to the next middleware
        req.findedUser = user;
        next();
      })
      // all kinds of error will be finally catched here
      .catch((err: string) => res.status(401).send(err));
  },
};
