const express = require('express');
const router = express.Router();
const {people} = require('../Controllers/index');

router.get('/search', people.listUsers);
router.get('/listAllFriends', people.listAllFriends);


router.post('/connections/send-connection/:connectionId', people.requestConnection);

router.get('/listallconnections', people.listAllConnections);
// router.post('/requestconnection/:connectionId', people.requestConnection);

// router.post('/respondtorequest', people.respondToRequest);
router.get('/listAllRequest', people.listAllRequest);
router.post('/requests/:requestId/accept', people.acceptRequest);
router.post('/requests/:requestId/reject', people.rejectRequest);



module.exports = router;
