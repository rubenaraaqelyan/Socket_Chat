import jwt from 'jsonwebtoken';
import HttpError from "http-errors";

const { JWT_SECRET } = process.env;
const EXCLUDE = [
  '/users/login',
  '/users/register',
];

export default function authorization(req, res, next) {
  try {
    const { authorization } = req.headers;
    const { url } = req;
    if (EXCLUDE.includes(url) || req.method === 'OPTIONS') {
      next();
      return;
    }

    const token = (authorization || '').replace('Bearer ', '');
    try {
      const data = jwt.verify(token, JWT_SECRET);
      req.userId = data.userId;
    } catch (e) {
      //
    }
    if (!req.userId) {
      throw HttpError(403, 'invalid token');
    }
    next();
  } catch (e) {
    next(e);
  }
}
