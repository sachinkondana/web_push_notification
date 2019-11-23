// =======================================

// Public Key:
// BMKj2U2qyu-HlijIEiZFAx8pWI65CpUdsTlELtEamy2WMWUCDbS2vRRGzS1pi0DTuB_9Ug3wavGz7x3I22ZOFGI

// Private Key:
// WCX6X2f7XCdKWAdg5UWesaAEFC2_qm9wWNrGKFETkqs

// =======================================

/**
 * When using your VAPID key in your web app,
 * you'll need to convert the URL safe base64 string to a Uint8Array to pass into the subscribe call,
 * which you can do like so:
 * more details: https://www.npmjs.com/package/web-push
 * @param {string} base64String
 */
const urlB64ToUint8Array = base64String => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray;
}

/**
 * Check if serviceWorker is in navigator browser object
 * then on window load event trigger
 * register service worker
 */
if ('serviceWorker' in navigator && 'PushManager' in window) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js')
      .then(async (reg) => {
        console.log('service worker registered');
        reg.pushManager.getSubscription()
          .then(function (sub) {
            if (sub) {
              document.getElementById('unsubscribe-btn').style.display = 'block';
              document.getElementById('subscribe-btn').style.display = 'none';
            } else {
              document.getElementById('unsubscribe-btn').style.display = 'none';
              document.getElementById('subscribe-btn').style.display = 'block';
            }
          });
        // NOTE: get permission as the user opens the link
        // try {
        //   await checkIfUserIsSubscribedToNotification(reg);
        // }
        // catch (error) {
        //   console.log('Something went wrong, while calling checkIfUserIsSubscribedToNotification');
        // }
      })
      .catch(err => console.log('service worker not registered', err));
  });

  const checkIfUserIsSubscribedToNotification = (reg) => {
    /**
         * if reg.pushManager.getSubscription() result is undefined or null (empty), that means user is not registered to push notification
         * in that case, get user to register for push notification
         * else You have to update subscription details to the database,
         * so that serve can send you push notification using subscription details
         */
    new Promise((resolve, reject) => {
      reg.pushManager.getSubscription()
        .then(async (sub) => {
          if (!sub) {
            try {
              await AskUserPermissionForSendingNotification(reg);
            }
            catch (error) {
              console.log('Something went wrong, while calling AskUserPermissionForSendingNotification');
              reject();
            }
          } else {
            document.getElementById('unsubscribe-btn').style.display = 'block';
            document.getElementById('subscribe-btn').style.display = 'none';
            console.log('You have subscription update the database on your server');
          }
        })
        .catch((err) => {
          console.log(err);
          reject();
        })
      resolve();
    })
  }

  const AskUserPermissionForSendingNotification = async (reg) => {
    // NOTE: endpoint needs to be secret or other application might send you push notifications
    new Promise(async (resolve) => {
      // The subscribe() method of the PushManager interface subscribes to a push service.
      // It pop-up notification permisssion in browser, while opened the link for first time.
      reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array('BMKj2U2qyu-HlijIEiZFAx8pWI65CpUdsTlELtEamy2WMWUCDbS2vRRGzS1pi0DTuB_9Ug3wavGz7x3I22ZOFGI')
      })
        .then(async (sub) => {
          try {
            await saveSubscriptionDetailsToDataBase(sub);
            document.getElementById('unsubscribe-btn').style.display = 'block';
            document.getElementById('subscribe-btn').style.display = 'none';
          } catch (error) {
            console.log('Something went wrong, while calling saveSubscriptionDetailsToDataBase');
            reject();
          }
        })
        .catch((err) => {
          console.log(err);
        })
      resolve();
    });
  }

  const saveSubscriptionDetailsToDataBase = (sub) => {
    new Promise((resovle, reject) => {
      fetch('http://localhost:4000/api/save-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sub)
      })
        .catch((err) => {
          console.log(err);
          reject();
        })
      resovle();
    });
  }

  document.getElementById("unsubscribe-btn").addEventListener("click", function () {
    // https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription/unsubscribe
    navigator.serviceWorker.ready.then(function (reg) {
      reg.pushManager.getSubscription().then(function (subscription) {
        subscription.unsubscribe().then(async (successful) => {
          await saveSubscriptionDetailsToDataBase({});
          document.getElementById('unsubscribe-btn').style.display = 'none';
          document.getElementById('subscribe-btn').style.display = 'block';
        }).catch(function (e) {
          console.log('Unsubscription failed');
        });
      })
    });
  });

  document.getElementById("subscribe-btn").addEventListener("click", function () {
    // The getRegistration() method of the ServiceWorkerContainer interface gets a ServiceWorkerRegistration
    navigator.serviceWorker.getRegistration()
      .then((reg) => {
        checkIfUserIsSubscribedToNotification(reg);
      });
  });

}

