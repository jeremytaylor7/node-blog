const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { BlogPosts } = require('./models');
const app = express();



router.get('/', (req, res) => {
    res.json(BlogPosts.get());
    console.log('getting blog posts');
});

router.post('/', jsonParser, (req, res) => {
    // ensure `name` and `budget` are in request body
    const requiredFields = ['title', 'content', 'author', 'publishDate'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
    res.status(201).json(item);
});

router.delete('/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted Blog Post \`${req.params.ID}\``);
    res.status(204).end();

});

router.put('/:id', jsonParser, (req, res) => {
    const required = ['title', 'content', 'author', 'publishDate'];
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
    console.log(`Updating Blog Post \`${req.params.id}\``);
    BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: req.body.publishDate
    })
    res.json(req.body);
})

module.exports = router;