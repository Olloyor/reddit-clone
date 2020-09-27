const express = require('express');
// const cors = require('cors')
const {corsOrigin} = require("../utils/envs")
const auth = require("./route.auth")
const users = require("./route.user")
const posts = require("./route.post")
const comments = require("./route.comment")
const votes = require("./route.vote")

const error = require("../middleware/error")


module.exports = function (app) {
    app.use(express.json());
    // app.use(cors({origin: corsOrigin}));
    app.use(express.urlencoded({extended: true}));
    app.use(express.static("public"));
    app.use(express.static(process.cwd() + "/client-ng/build"));
    app.use('/api/auth', auth)
    app.use('/api/user', users)
    app.use('/api/post', posts)
    app.use('/api/comment', comments)
    app.use('/api/vote', votes)
    app.use(error);
    app.get('/', (req, res) => {
        res.sendFile(process.cwd() + "/client-ng/build/index.html")
    });
    app.use((req, res, next) => {
        res.sendFile(process.cwd() + "/client-ng/build/index.html")
        // res.status(404).send({
        //     status: 404,
        //     error: 'Not found',
        //     message: "No Route like this"
        // })
    })
}
