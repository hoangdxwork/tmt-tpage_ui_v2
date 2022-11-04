importScripts('https://www.gstatic.com/firebasejs/9.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.13.0/firebase-messaging-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.13.0/firebase-analytics-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAAnP3M-JqrBLr-AGoHTZ1Qtx7QR0MXGVQ",
  authDomain: "tposmobile.firebaseapp.com",
  databaseURL: "https://tposmobile.firebaseio.com",
  projectId: "tposmobile",
  storageBucket: "tposmobile.appspot.com",
  messagingSenderId: "852209026200",
  appId: "1:852209026200:web:ef6ad3d5d7573855a63ced",
  measurementId: "G-XHX5BTL43H"
};

const messaging = firebase.messaging();
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

messaging.setBackgroundMessageHandler(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.data.title;
  const notificationOptions = {
      body: payload.data.body,
      icon: '/firebase-logo.png',
      data: payload.data
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    let navigateUrl = event.notification.data.click_action;
    event.waitUntil(clients.openWindow(navigateUrl));
});


