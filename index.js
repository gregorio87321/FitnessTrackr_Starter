// create an api router


// // attach other routers from files in this api directory (users, activities...)
// // export the api router
// module.exports = apiRouter;

const express = require('express');
const jwt = require('jsonwebtoken');
const usersRouter = require('./users');
const postsRouter = require('./posts');
const { getAuthorById } = require('../db');

const { JWT_SECRET } = process.env || 'SECRET';
const apiRouter = express.Router();

// MIDDLEWARE

apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer';
  const auth = req.header('Authorization');

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length + 1);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getAuthorById(id);
      }
      next();
    } catch (error) {
      next({
        name: error.name,
        message: error.message,
      });
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: 'Authorization token must begin with "Bearer"',
    });
  }
});

// ROUTERS

apiRouter.use('/users', usersRouter);
// apiRouter.user("/activities", require("./activities"))
apiRouter.use('/posts', postsRouter);

// Replaced in /index.js
// apiRouter.use((error, req, res, next) => {
//     res.send(error);
// });

module.exports = apiRouter;