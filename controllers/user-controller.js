const { User, Thought } = require('../models');

const userController = {
    //GET all users 
    getAllUser(req, res) {
        User.find({})
        .select('__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        })
    },

    // GET /api/users/:id
    getUserById({ params }, res) {
        User.findOne({ id: params.id })
        .populate([
            { path: 'thought', select: "__v"},
            { path: 'friends', select: "__v"}
        ])
        .select('__v')
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: "No user found with this id!"});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
},
        // POST /api/users/:id
        createUser({ body }, res) {
            User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err));
        },

        // PUT /api/users/:id
        updateUser({ params, body }, res) {
            User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
        },

        // DELETE /api/users/:id
        deleteUser({params}, res) {
            User.findOneAndDelete({ _id: params.id})
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id' });
                    return;
                }
                // remove the user from from and friends array
                User.updateMany(
                    { _id: {$in: dbUserData.friends } },
                    { $pull: {friends: params.id } }
                )
                .then(() => {
                    // remove any comments from this user
                    Thought.deleteMany({ username: dbUserData.username })
                    .then(() => {
                        res.json({ message: 'Succesfully deleted user' });
                    })
                    .catch(err => res.status(400).json(err));
                    })
                    .catch(err => res.status(400).json(err));
                })
                .catch(err => res.status(400).json(err));
            },

            // post /api/users/:id/friends/friendId
            addFriend({params}, res) {
                // add friendId to userId's freind list
                User.findOneAndUpdate(
                    { _id: params.userId },
                    { $addToSet: { friends: params.id } },
                    { new: true, runValidators: true }
                )
                .then(dbUserData => {
                    if (!dbUserData) {
                        res.status(404).json({ message: 'No user found with this userId'});
                        return;
                    }
                    // add userId to friends's friend list
                    User.findOneAndUpdate(
                        { _id: params.friendId },
                        { $addToSet: { friends: params.userId } },
                        { new: true, runValidators: true }
                    )
                    .then(dbUserData2 => { 
                        if (!dbUserData2) {
                            res.status(404).json({ message:'No user found with this friendid'})
                            return;
                        } 
                        res.json(dbUserData);                           
                    })
                    .catch(err => res.json(err));
                })
                .catch(err => res.status.json(err));
            },

            // delete /api/users/:userid/friends/:friendId
            deleteFriend({ params }, res) {
                // remove friendId from userId's friend list
                User.findOneAndUpdate(
                    { _id: params.userId },
                    { $pull: { friends: params.friendId } },
                    { new: true, runValidators: true }
                )
                .then(dbUserData => {
                    if (!dbUserData) {
                        res.status(404).json({ message: 'No user found with this userId' });
                        return;
                    }
                    // remove userId from friendId's friend list
                    User.findOneAndUpdate(
                        { _id: params.friendId },
                        { $pull: { friends: params.userId } },
                        { new: true, runValidators: true }
                    )
                    .then(dbUserData2 => {
                        if(!dbUserData2) {
                            res.status(404).json({ message: 'No user found with this friendId' })
                            return;
                        }
                        res.json({message: 'Successfully deleted the friend'});
                    })
                    .catch(err => res.json(err));
                })
                .catch(err => res.json(err));
            }
             
}    
            module.exports = userController;
        

        


        


