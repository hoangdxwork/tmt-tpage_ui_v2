importScripts('https://www.gstatic.com/firebasejs/9.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.13.0/firebase-messaging-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.13.0/firebase-analytics-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAAnP3M-JqrBLr-AGoHTZ1Qtx7QR0MXGVQ",
  authDomain: "tposmobile.firebaseapp.com",
  databaseURL: "https://tposmobile.firebaseio.com",
  projectId: "tposmobile",
  storageBucket: "tposmobile.appspot.com",
  messagingSenderId: "852209026200",
  appId: "1:852209026200:web:ef6ad3d5d7573855a63ced",
  measurementId: "G-XHX5BTL43H"
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  // fcp_options.link field from the FCM backend service goes there, but as the host differ, it not handled by Firebase JS Client sdk, so custom handling
  if (event && event.notification && event.notification.data && event.notification.data.FCM_MSG && event.notification.data.FCM_MSG.notification) {

      const data = event.notification.data.FCM_MSG;
      const url = `https://${data.data.TenantId}/tpagev2/#/user/firebase-notification?id=${data.data.NotificationId}`;

      event.waitUntil(
          self.clients.matchAll({type: 'window'}).then( windowClients => {
              // Check if there is already a window/tab open with the target URL
              for (var i = 0; i < windowClients.length; i++) {
                  var client = windowClients[i];
                  // If so, just focus it.
                  if (client.url === url && 'focus' in client) {
                      return client.focus();
                  }
              }
              // If not, then open the target URL in a new window/tab.
              if (self.clients.openWindow) {
                  console.log("open window")
                  return self.clients.openWindow(url);
              }
          })
      )
  }
}, false);

const messaging = firebase.messaging();
