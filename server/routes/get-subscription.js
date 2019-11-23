const express = require('express');
const router = express.Router();
const subscriptionObject = require('./save-subscription');

router.get('/', function (req, res) {

  res.send({
    status: 200,
    message: 'message sent',
    data: subscriptionObject.dummyDb.subscription
  });
});

module.exports = router;
