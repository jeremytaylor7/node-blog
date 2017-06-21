const uuid = require('uuid');
const mongoose = require('mongoose');
mongoose.set('debug', true);

const BlogSchema = mongoose.Schema({
    title: String,
    author: {
        firstName: String,
        lastName: String,
    },
    content: String,
    created: String
})
const BlogPost = mongoose.model('blog-post', BlogSchema);

module.exports = BlogPost;