const router = require('express').Router();

const developerRoutes = require('./developer-routes');
const postRoutes = require('./post-routes');
const commentRoutes = require('./comment-routes');

router.use('/developers', developerRoutes)
router.use('/posts', postRoutes)
router.use('/comments', commentRoutes);

module.exports = router;
