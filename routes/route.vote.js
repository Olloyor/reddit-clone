const Joi = require('joi');
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const isValidId = require('../middleware/isValidObjectID')
const {User} = require('../modules/user');
const {Post} = require('../modules/post');
const {Vote,validateVote} = require('../modules/vote');


const ApiResponse = require('../ApiResponse')

// @Vote Posts
// @Method: POST
// @Route: api/vote/
router.post("/", [auth], async (req, res) => {
    const {error} = validateVote(req.body);
    if (error) return res.status(400).send(new ApiResponse(error.details[0].message, false));

    const user = await User.findOne({_id: req.user._id})
    if (!user) return res.status(404).send(new ApiResponse("Couldn't find user", false))

    const post = await Post.findOne({_id: req.body.postId})
    if (!post) return res.status(404).send(new ApiResponse("Couldn't find post", false))

    const vote = await Vote.findOne({user:user._id, post: post._id})
    if (vote && vote.voteType === req.body.voteType.toString())  return res.status(200).send(new ApiResponse("You already Voted "+req.body.voteType, false))

    if (!vote){
        const newVote = new Vote({
            voteType: req.body.voteType,
            post: post._id,
            user: user._id
        });
        await newVote.save();
    }else{
        vote.voteType = req.body.voteType;
        vote.updatedAt = new Date();
        await vote.save();
    }

    post.voteCount = post.voteCount + (parseInt(req.body.voteType))
    await post.save();
    res.status(200).send(new ApiResponse("Post Voted", true));
})




module.exports = router;
