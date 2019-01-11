import jwt from 'jsonwebtoken';

const secret = process.env.AUTHSECRET || 'my secret for development in local environment.';
export default {
  generateToken(payload: any) {
    return jwt.sign(payload, secret);
  },
  verifyToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err: any, decoded: any) => {
        if(err) {
          reject(err);
        }
        resolve(decoded);
      });
    });
  }
}