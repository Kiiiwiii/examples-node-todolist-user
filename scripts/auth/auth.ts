import jwt from 'jsonwebtoken';

const secret = process.env.AUTHSECRET || 'my secret for development in local environment.';
export default {
  generateToken(payload: any) {
    return jwt.sign(payload, secret);
  },
  verifyToken(token: string, cb: (err: any, decoded: any) => any) {
    jwt.verify(token, secret, cb);
  }
}