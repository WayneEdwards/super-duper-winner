const { Schema, model, Types } = require('mongoose');
const moment = require('moment');

const ReactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId, 
        default: () => Types.ObjectId()     
    },
    reactionBody: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 280
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => moment(createdAtVal).format('MM DD, YYYY [at] hh:mm a')
    }
},
{ 
    toJSON: {
        getters: true
    },
    id: false
});

module.exports = ReactionSchema;



