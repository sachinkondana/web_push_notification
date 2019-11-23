const express = require('express');
const webpush = require('web-push');
const config = require('config');

const router = express.Router();
const subscriptionObject = require('./save-subscription');

router.get('/', function (req, res) {
  if (Object.keys(subscriptionObject.dummyDb.subscription).length) {
    try {
      //setting our previously generated VAPID keys
      webpush.setVapidDetails(
        'mailto:cc@gmail.com',
        config.get('vapid_publicKey'),
        config.get('vapid_privateKey')
      )

      //function to send the notification to the subscribed device
      const sendNotification = (subscription, dataToSend) => {
        webpush.sendNotification(subscription, dataToSend)
      }

      //route to test send notification
      const subscription = subscriptionObject.dummyDb.subscription //get subscription from your databse here.

      let options = {

        body: 'notification body!',

        // The badge is a small monochrome icon that is used to portray a little more information to the user about where the notification is from.
        // 128x128
        badge: 'https://media.gettyimages.com/photos/pumpkin-salad-picture-id635912088?s=2048x2048',

        // The icon option is essentially a small image you can show next to the title and body text.
        // In your code you just need to provide a URL to the image you'd like to load.
        // 512x512
        icon: 'https://media.gettyimages.com/photos/pumpkin-salad-picture-id635912088?s=2048x2048',

        // The image option can be used to display a larger image to the user. This is particularly useful to display a preview image to the user.
        // 1600x1100
        image: 'https://media.gettyimages.com/photos/pumpkin-salad-picture-id635912088?s=2048x2048',

        // The tag option is essentially a string ID that "groups" notifications together, providing an easy way to determine how multiple notifications are displayed to the user.
        // use case is for chat application, showing no. of message got from the same contact.
        // tag: 'Here is a notification tag',

        // You can defined actions to display buttons with a notification.
        actions: [
          {
            action: 'contact',
            title: 'contact',
            // icon: 'conatct-img.png'
          },
          {
            action: 'about',
            title: 'about',
            // icon: 'about-img.png'
          }
        ],

        // Chrome on desktop will show notifications for a set time period before hiding them.
        //Chrome on Android doesn't have this behavior. Notifications are displayed until the user interacts with them.
        // To force a notification to stay visible until the user interacts with it, add the requireInteraction option. This will show the notification until the user dismisses or clicks your notification.
        // This option allows you to keep the notification until user interaction in the notification
        requireInteraction: true,

        //This option allows you to show a new notification but prevents the default behavior of vibration, sound and turning on the device's display.
        // silent: false,

        // When a push message is received it's common to have data that is only useful if the user has clicked the notification.
        // For example, the URL that should be opened when a notification is clicked.
        // The easiest way to take data from a push event and attach it to a notification is to add a data parameter
        data: {
          title: 'My first push notification!!!!',
          notificationLink: '/',
          contactUrl: 'pages/contact.html',
          aboutUrl: 'pages/about.html'
        }
      };

      sendNotification(subscription, JSON.stringify(options));
    }
    catch (error) {
      res.send({
        status: 201,
        message: 'Error in handling request'
      });
    }
  }

  res.send({
    status: 200,
    message: Object.keys(subscriptionObject.dummyDb.subscription).length ? 'Notification sent' : 'User not subscribed to notification',
  });
});

module.exports = router;
