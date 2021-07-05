const router = require('express').Router();

const {
    getAllThought,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought
} = require('../../controllers/thought-controller');

// /api/thoughts
router
.route('/')
.get(getAllThought)
.post(createThought);

// /api/thoughts/:id
router
.route('/:id')
.get(getThoughtById)
.put(updateThought)
.delete(deleteThought);

router.route('/:thoughtId/reactions/')
.post(addReaction)
.delete(deleteReaction)

module.exports = router;