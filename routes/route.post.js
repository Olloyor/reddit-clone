const Joi = require('joi');
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const isValidId = require('../middleware/isValidObjectID')
const {User} = require('../modules/user');
const {Post, validate} = require('../modules/post');


const ApiResponse = require('../ApiResponse')


router.post("/add", [auth], async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send({error: error.details[0].message});

    try {
        // const user = await User.findOne({_id: req.user._id})
        // if (!user) return res.status(404).send({error: "Couldn't find user"})

        const newPost = new Post({
            name: req.body.name,
            url: req.body.url,
            description: req.body.description,
            user: req.user._id,
            creatorName: req.user.name,
            updatedAt: new Date()
        });
        await newPost.save();
        res.status(201).send(newPost);
    } catch (e) {
        console.log(e)
        return res.status(500).send({error: 'Something went wrong'});
    }
})

// @Get All Posts
// @Method: GET
// @Route: api/post/all
router.get("/all", async (req, res) => {
    const posts = await Post.find().sort({createdAt: 'desc'})
    if (!posts) return res.status(404).send(new ApiResponse("No Posts Yet", false))
    res.status(200).send(posts)
});


// @Get Post by ID
// @Method: GET
// @Route: api/post/postId
router.get("/:id", [isValidId], async (req, res) => {

    let post = await Post.findOne({_id: req.params.id});
    if (!post) return res.status(404).send(new ApiResponse('Post Not Found.', false));
    res.send(post)
})

// @Get Post by Username
// @Method: GET
// @Route: api/post/userID
router.get("/by_user/:id", [isValidId], async (req, res) => {

    const user = await User.findOne({_id: req.params.id})
    if (!user) return res.status(404).send(new ApiResponse("User Not found", false))

    let posts = await Post.find({user: user._id});
    // if (!posts) return res.status(404).send(new ApiResponse('Posts Not Found.', false));

    res.send(posts)
})


module.exports = router;
