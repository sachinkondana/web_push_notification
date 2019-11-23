self.addEventListener('notificationclose', (event) => {
  console.log('Closed notification');
});

self.addEventListener('push', (event) => {
  if (event.data) {
    showLocalNotification(event.data.json(), self.registration);
  } else {
    console.log('Push event triggered, but no data');
  }
});

const showLocalNotification = (body, swRegistration) => {
  swRegistration.showNotification(body.data.title, body);
};

self.addEventListener('notificationclick', (event) => {
  console.log(event);
  // One of the most common responses to a notification is to open a window / tab to a specific URL. We can do this with the clients.openWindow() API
  var action = event.action;
  if (action === 'contact') {
    // event.waitUntil(event.notification.data.contactUrl);
    goToTheOpenedTabIfSameLinkIsClicked(event.notification.data.contactUrl, event);
  } else if (action === 'about') {
    // event.waitUntil(event.notification.data.aboutUrl);
    goToTheOpenedTabIfSameLinkIsClicked(event.notification.data.aboutUrl, event);
  }
  else {
    // event.waitUntil(event.notification.data.notificationLink);
    goToTheOpenedTabIfSameLinkIsClicked(event.notification.data.notificationLink, event);
  }
});

const goToTheOpenedTabIfSameLinkIsClicked = (url, event) => {
  const urlToOpen = new URL(url, self.location.origin).href;

  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
    .then((windowClients) => {
      let matchingClient = null;

      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (windowClient.url === urlToOpen) {
          matchingClient = windowClient;
          break;
        }
      }

      if (matchingClient) {
        return matchingClient.focus();
      } else {
        return clients.openWindow(urlToOpen);
      }
    });

  event.waitUntil(promiseChain);
}

