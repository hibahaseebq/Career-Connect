// userRoutes.js
const express = require('express');
const router = express.Router();
const {user} = require('../Controllers/index');

router.post('/signin', user.signIn);
router.post('/signup', user.create);
router.delete('/delete', user.deleteUser);
router.post('/verify-email', user.verifyEmail);
router.post('/profile-details', user.profileDetails);
// router.post('/signout', user.signOut);


// router.post('/login', user.login);

module.exports = router;
