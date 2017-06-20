const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');

const BlogPosts = require('./models');
const app = express();

mongoose.Promise = global.Promise;



/*
create four endpoints:
get /posts

use Schema: Title, Author, Content, Created
validates that the request body includes title,
content, and author, and returns a 400 status and a helpful error message
if one of these is missing.
return post with same key value pairs as when you use get request

get /posts/:id
post /posts
put /posts/:id
delete /posts/:id

Errors:
if any requests fail return 500 error code along with "internal server error" message.
*/


router.get('/', (req, res) => {
    BlogPosts
        .find()
        .limit(100)
        .exec()
        .then(blogPosts => {
            res.json({
                blogs: blogPosts
            });
        })
        .catch(
        err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        });
});

router.get('/:id', (req, res) => {
    BlogPosts
        .findById(req.params.id)
        .exec()
        .then(blogPosts => {
            res.json({
                blogs: blogPosts
            });
        })
        .catch(
        err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' })
        });
});


router.post('/', (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    BlogPosts
        .create({
            title: req.body.title,
            author: req.body.author,
            content: req.body.content
        })
        .then(
        blogPost => res.status(201).json({ blogPost }))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal Server error' })
        })
});

router.delete('/:id', (req, res) => {
    BlogPosts
        .findByIdAndRemove(req.params.id)
        .exec()
        .then(blogPost => res.status(204).end)
        .catch(err => res.status(500).json({ message: 'Internal Server error' }))

});

router.put('/:id', jsonParser, (req, res) => {
    const required = ['title', 'content', 'author'];
    for (let i = 0; i < required.length; i++) {
        const field = required[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.id) {
        const message =
            `Request id (${req.params.id}) and request body id
                ${req.body.id} must match`;
        console.error(message);
        return res.status(400).send(message);
    }
    const toUpdate = {};
    const updateableFields = ['title', 'author', 'content']

    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });

    BlogPosts
        .findByIdAndUpdate(req.params.id, { $set: toUpdate })
        .exec()
        .then(
        blogPost => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Internal Server error' }))

});

module.exports = router;