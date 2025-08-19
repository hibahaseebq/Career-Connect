// profileRoute.js
const express = require('express');
const router = express.Router();
const {profile} = require('../Controllers/index');

router.get('/getProfiles', profile.getProfile);
router.post('/create', profile.createProfile);
router.put('/update/:userId', profile.updateProfile);
router.get('/get/:userId', profile.getProfile);
router.get('/getSecureUser', profile.getSecureUser);
router.delete('/delete/:userId', profile.deleteProfile);
router.get('/main-nav-profile', profile.getMainNavProfileByAdmin);


module.exports = router;
