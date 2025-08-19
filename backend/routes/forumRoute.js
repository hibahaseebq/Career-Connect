const express = require('express');
const router = express.Router();
const {forum} = require('../Controllers/index');

router.get('/list-all-forum', forum.getQuestionsList);
router.post('/post-forum', forum.postQuestion);
router.post('/reply-forum/:post_id', forum.postReplyToQuestion);



module.exports = router;
