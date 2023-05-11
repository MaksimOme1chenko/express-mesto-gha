const token = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const AuthorizationError = require('../errors/UnauthorizedError');
// eslint-disable-next-line consistent-return
// const auth = (req, res, next) => {
//   const { authorization } = req.headres;

//   if (!authorization || !authorization.startsWith('Bearer ')) {
//     return res.status(401).send({ message: 'Необходима автоизация' });
//   }

//   const token = authorization.replace('Bearer ', '');
//   let payload;

//   try {
//     payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
//   } catch (err) {
//     return res
//       .status(401)
//       .send({ message: 'Необходима авторизация' });
//   }
//   req.user = payload;
//   next();
// };
// module.exports = { auth };

const auth = (req, res, next) => {
  const { jwt } = req.cookies;

  if (!jwt) {
    next(new AuthorizationError('Необходима авторизация'));
    return;
  }

  let payload;

  try {
    payload = token.verify(jwt, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new AuthorizationError('Необходима авторизация'));
    return;
  }

  req.user = payload;

  next();
};
module.exports = { auth };
