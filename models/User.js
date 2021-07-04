const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const UserSchema =new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/.+@.+\..+/]
        },
        thoughts: [{ type: Schema.Type.ObjectId, ref: 'Thought' }],
        friends: [{ type: Schema.Type.ObjectId, ref: 'User'}]
    },
    { 
        toJSON: {
            virtuals: true
        },
        id: false  
    });

    UserSchema.virtual('friendCount').get(function() {
        return this.friends.length;
    });

    const User = model('User', UserSchema);

    module.exports = User;