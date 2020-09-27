const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    url: {
        type: String
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
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


const Comment = mongoose.model('Comment', commentSchema);

function validateComment(comment) {
    const schema = {
        text: Joi.string().min(2).max(50).required(),
        post: Joi.objectId().required()
    };

    return Joi.validate(comment, schema);
}

exports.Comment = Comment;
exports.validate = validateComment;
