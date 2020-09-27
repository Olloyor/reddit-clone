const Joi = require('joi');
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const isValidId = require('../middleware/isValidObjectID')
const {User} = require('../modules/user');
const {Post} = require('../modules/post');
const {Comment, validate} = require('../modules/comment');


const ApiResponse = require('../ApiResponse')


router.post("/create", [auth], async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(new ApiResponse(error.details[0].message, false));

    try {
        // const user = await User.findOne({_id: req.user._id})
        // if (!user) return res.status(404).send(new ApiResponse("Couldn't find user", false))

        const post = await Post.findOne({_id: req.body.post})
        if (!post) return res.status(404).send(new ApiResponse("Post Not Found", false))

        const newComment = new Comment({
            text: req.body.text,
            post: req.body.post,
            user: req.user._id,
            creatorName: req.user.name,
            updatedAt: new Date()
        });
        post.commentCount = post.commentCount + 1;

        await newComment.save();
        await post.save();
        res.status(201).send(newComment);
    } catch (e) {
        console.log(e)
        return res.status(500).send({error: 'Something went wrong'});
    }
})


// @Get Comments by PostID
// @Method: GET
// @Route: api/comment/by_post/postId
router.get("/by_post/:id", [isValidId], async (req, res) => {

    const post = await Post.findOne({_id: req.params.id})
    if (!post) return res.status(404).send(new ApiResponse("Post Not Found", false))

    let comments = await Comment.find({post: req.params.id}).sort({createdAt: 'desc'});
    // if (comments.length === 0) return res.status(404).send(new ApiResponse('Comments Not Found.', false));
    res.send(comments)
})

// @Get Comment by Username
// @Method: GET
// @Route: api/comment/by_user/userID
router.get("/by_user/:id", [isValidId], async (req, res) => {

    const user = await User.findOne({_id: req.params.id}).select('-password -__v -uuid');

    if (!user) return res.status(404).send(new ApiResponse("User Not found", false))

    let comments = await Comment.find({user: user._id});
    // if (comments.length === 0) return res.status(404).send(new ApiResponse('Comments Not Found.', false));

    res.send(comments);
})


module.exports = router;
