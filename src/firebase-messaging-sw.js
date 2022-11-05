importScripts('https://www.gstatic.com/firebasejs/9.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.13.0/firebase-messaging-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.13.0/firebase-analytics-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyB13Zlrc54Xz2qZwBOsZN1cGwkWUV7RDiw",
  authDomain: "propane-bebop-278706.firebaseapp.com",
  projectId: "propane-bebop-278706",
  storageBucket: "propane-bebop-278706.appspot.com",
  messagingSenderId: "528073803166",
  appId: "1:528073803166:web:ebd0d1f5d380cdd86c428f",
  measurementId: "G-PMJ8HGCCT1"
};

const messaging = firebase.messaging();
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

messaging.onMessage(function(payload) {
  console.log(payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
      body: payload.notification.body,
      icon: payload.notification.icon,
  };
  // console.log(notificationTitle,notificationOptions)

  if (!("Notification" in window)) {
      console.log("This browser does not support system notifications.");
  } else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      var notification = new Notification(notificationTitle,notificationOptions);
      notification.onclick = function(event) {
          event.preventDefault();
          window.open(payload.notification.click_action , '_blank');
          notification.close();
      }
  }
});

// messaging.setBackgroundMessageHandler(function (payload) {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);

//   const notificationTitle = payload.data.title;
//   const notificationOptions = {
//       body: payload.data.body,
//       icon: '/firebase-logo.png',
//       data: payload.data
//   };

//   return self.registration.showNotification(notificationTitle, notificationOptions);
// });

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    let navigateUrl = event.notification.data.click_action;
    event.waitUntil(clients.openWindow(navigateUrl));
});


