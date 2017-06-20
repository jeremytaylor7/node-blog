const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, runServer, closeServer } = require('../server.js');

const should = chai.should();


chai.use(chaiHttp);


describe('Blog Requests', function () {
    before(function () {
        return runServer();
    });
    after(function () {
        return closeServer();
    });
    it('should return list of items on GET',
        function () {
            return chai.request(app)
                .get('/blog-posts')
                .then(function (res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.should.be.a('object');
                    res.body.length.should.be.at.least(1);
                    const expectedKeys = ['author', 'content', 'publishDate', 'title', 'id'];
                    res.body.forEach(function (item) {
                        item.should.be.a('object');
                        item.should.include.keys(expectedKeys);
                    });
                });
        });
    it('should post item', function () {
        const testItem = {
            author: "jeremy",
            content: "Hotel Reverse",
            publishDate: "Aug 1 2015",
            title: "Hotel Reverse"
        };
        return chai.request(app)
            .post('/blog-posts')
            .send(testItem)
            .then(function (res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.not.be.null;
                res.body.should.deep.equal(Object.assign(testItem,
                    { id: res.body.id }
                ));
            })


    })
    it('should update item', function () {
        const updateInfo = {
            author: "jeremy",
            content: "Hotel Reverse",
            publishDate: "Aug 1 2015",
            title: "Hotel Reverse"
        };

        return chai.request(app)
            .get('/blog-posts')
            .then(function (res) {
                updateInfo.id = res.body[0].id;
                return chai.request(app)
                    .put(`/blog-posts/${updateInfo.id}`)
                    .send(updateInfo);
            })
            .then(function (res) {
                res.should.have.status(200);
                res.should.be.json;
                res.should.be.a('object');
                res.body.should.deep.equal(updateInfo);
            })
    })
    it('should delete item', function () {
        return chai.request(app)
            .get('/blog-posts')
            .then(function (res) {
                return chai.request(app)
                    .delete(`/blog-posts/${res.body[0].id}`)
            })
            .then(function (res) {
                res.should.have.status(204);
            })
    })
});