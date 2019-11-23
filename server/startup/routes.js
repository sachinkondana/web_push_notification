const express = require('express');
const testconnection = require('../routes/test-connection');
const sendNotification = require('../routes/send-notification');
const saveSubscription = require('../routes/save-subscription');
const getSubscription = require('../routes/get-subscription');

module.exports = function (app) {
  app.use(express.json());
  app.use('/api/test-connection', testconnection);
  app.use('/api/save-subscription', saveSubscription.router);
  app.use('/api/send-notification', sendNotification);
  app.use('/api/get-subscription', getSubscription);
}
