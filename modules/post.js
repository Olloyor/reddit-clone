const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    url: {
        type: String
    },
    description: {
        type: String,
        required: true,
        minlength: 15,
        maxlength: 1500
    },
    voteCount: {
        type: Number,
        default: 0
    },
    commentCount: {
        type: Number,
        default: 0
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    creatorName:{
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
});


const Post = mongoose.model('Post', postSchema);

function validatePost(post) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        description: Joi.string().min(15).max(1500).required(),
    };

    return Joi.validate(post, schema);
}

exports.Post = Post;
exports.validate = validatePost;
