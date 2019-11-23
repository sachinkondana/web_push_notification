const express = require('express');
const router = express.Router();
const dummyDb = { subscription: {} } //dummy in memory store

router.post('/', async (req, res) => {
  try {

    const saveToDatabase = async subscription => {
      // Since this is a demo app, I am going to save this in a dummy in memory store. Do not do this in your apps.
      // Here you should be writing your db logic to save it.
      dummyDb.subscription = subscription
    }

    const subscription = req.body
    console.log(subscription);

    await saveToDatabase(subscription) //Method to save the subscription to Database
  }
  catch (error) {
    res.send({
      status: 201,
      message: 'Error in handling request',
    });
  }

  res.send({
    status: 200,
    message: 'success',
  });
});

module.exports = {
  router,
  dummyDb
};
