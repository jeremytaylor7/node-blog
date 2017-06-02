//required modules

const express = require('express');
const app = express();
const routeBlogPost = require('./blog-posts');
const { BlogPosts } = require('./models');


BlogPosts.create('Harry Potter Snapple Facts',
    'There is a Harry Potter world in Universal Studios',
    'Jeremy Taylor',
    'Jun, 1, 2017'
);

console.log(routeBlogPost.stack);

app.use('/blog-posts', routeBlogPost);


app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});


