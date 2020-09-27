const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose');

const VoteType = Object.freeze({
    UPVOTE: 1,
    DOWNVOTE: -1,
});

const voteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    voteType: {
        type: String,
        enum: Object.values(VoteType),
        required: true
    },
    createdAt: {
        type: Date,
        overwrite:false,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
});


const Vote = mongoose.model('Vote', voteSchema);

function validateVote(vote) {
    const schema = {
        postId: Joi.objectId().required(),
        voteType: Joi.valid([VoteType.UPVOTE],[VoteType.DOWNVOTE]).required()
    };
    return Joi.validate(vote, schema);
}


exports.Vote = Vote;
exports.VoteType= VoteType;
exports.validateVote = validateVote;
