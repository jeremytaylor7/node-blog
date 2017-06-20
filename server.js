//required modules

const express = require('express');
const app = express();
const routeBlogPost = require('./blog-posts');
const mongoose = require('mongoose');
const BlogPosts = require('./models');
const bodyParser = require('body-parser');
mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
app.use(bodyParser.json());


let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {

    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
            if (err) {
                return reject(err);
            };
            console.log('Connected to DB!');
        })
        server = app.listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve();
        }).on('error', err => {
            reject(err)
        });
    });
};
function closeServer() {
    return new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
};


app.use('/blog-posts', routeBlogPost);

if (require.main === module) {
    runServer().catch(err => console.error(err));
};

module.exports = { app, runServer, closeServer };
