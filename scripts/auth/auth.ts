import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const secret = process.env.AUTHSECRET || 'my secret for development in local environment.';
const SALT_ROUNDS = 10;

export default {
  generateToken(payload: any) {
    return jwt.sign(payload, secret, {expiresIn: '30d'});
  },
  verifyToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err: any, decoded: any) => {
        if (err) {
          reject(err);
        }
        resolve(decoded);
      });
    });
  },
  hashPassword(password: string) {
    return bcrypt.genSalt(SALT_ROUNDS).then((salt: string) => {
      return bcrypt.hash(password, salt);
    });
  },
  comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  },
};
