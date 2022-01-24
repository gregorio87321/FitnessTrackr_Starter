const express = require('express');
const { getPosts, createPost } = require('../db');

const postsRouter = express.Router();

postsRouter.get('/', async (req, res, next) => {
  try {
    const posts = await getPosts();
    // console.log('posts:', posts);
    res.send({ posts: posts });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

postsRouter.post('/create', async (req, res, next) => {
  try {
    const postToCreate = req.body;
    console.log('postToCreate: ', postToCreate);
    if (!postToCreate.title || !postToCreate.content) {
      next({
        name: 'InvalidPost',
        message: 'Fields are missing from post being created',
      });
    } else {
      const createdPost = await createPost(postToCreate);
      console.log('createdPost: ', createdPost);
      // 1st test
      //   {createdPost: {
      //           title: 'Test Driven Development',
      //           content: 'I want to write tests to I can make a fortune of money at my job',
      //           tags: [ '#programming' ],
      //         views: 0
      //           }
      // }

      // 2nd test
      //{createdPost: {content: 'Whoopsie'}}
      res.send({ createdPost: createdPost });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = postsRouter;