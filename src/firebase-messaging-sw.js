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

// <script>
// // Retrieve Firebase Messaging object.
// const messaging = firebase.messaging();

// // IDs of divs that display registration token UI or request permission UI.
// const tokenDivId = 'token_div';
// const permissionDivId = 'permission_div';

// // Handle incoming messages. Called when:
// // - a message is received while the app has focus
// // - the user clicks on an app notification created by a service worker
// //   `messaging.onBackgroundMessage` handler.
// messaging.onMessage((payload) => {
//   console.log('Message received. ', payload);
//   // Update the UI to include the received message.
//   appendMessage(payload);
// });

// function resetUI() {
//   clearMessages();
//   showToken('loading...');
//   // Get registration token. Initially this makes a network call, once retrieved
//   // subsequent calls to getToken will return from cache.
//   messaging.getToken({vapidKey: '<YOUR_PUBLIC_VAPID_KEY_HERE>'}).then((currentToken) => {
//     if (currentToken) {
//       sendTokenToServer(currentToken);
//       updateUIForPushEnabled(currentToken);
//     } else {
//       // Show permission request.
//       console.log('No registration token available. Request permission to generate one.');
//       // Show permission UI.
//       updateUIForPushPermissionRequired();
//       setTokenSentToServer(false);
//     }
//   }).catch((err) => {
//     console.log('An error occurred while retrieving token. ', err);
//     showToken('Error retrieving registration token. ', err);
//     setTokenSentToServer(false);
//   });
// }


// function showToken(currentToken) {
//   // Show token in console and UI.
//   const tokenElement = document.querySelector('#token');
//   tokenElement.textContent = currentToken;
// }

// // Send the registration token your application server, so that it can:
// // - send messages back to this app
// // - subscribe/unsubscribe the token from topics
// function sendTokenToServer(currentToken) {
//   if (!isTokenSentToServer()) {
//     console.log('Sending token to server...');
//     // TODO(developer): Send the current token to your server.
//     setTokenSentToServer(true);
//   } else {
//     console.log('Token already sent to server so won\'t send it again ' +
//         'unless it changes');
//   }
// }

// function isTokenSentToServer() {
//   return window.localStorage.getItem('sentToServer') === '1';
// }

// function setTokenSentToServer(sent) {
//   window.localStorage.setItem('sentToServer', sent ? '1' : '0');
// }

// function showHideDiv(divId, show) {
//   const div = document.querySelector('#' + divId);
//   if (show) {
//     div.style = 'display: visible';
//   } else {
//     div.style = 'display: none';
//   }
// }

// function requestPermission() {
//   console.log('Requesting permission...');
//   Notification.requestPermission().then((permission) => {
//     if (permission === 'granted') {
//       console.log('Notification permission granted.');
//       // TODO(developer): Retrieve a registration token for use with FCM.
//       // In many cases once an app has been granted notification permission,
//       // it should update its UI reflecting this.
//       resetUI();
//     } else {
//       console.log('Unable to get permission to notify.');
//     }
//   });
// }

// function deleteToken() {
//   // Delete registration token.
//   messaging.getToken().then((currentToken) => {
//     messaging.deleteToken(currentToken).then(() => {
//       console.log('Token deleted.');
//       setTokenSentToServer(false);
//       // Once token is deleted update UI.
//       resetUI();
//     }).catch((err) => {
//       console.log('Unable to delete token. ', err);
//     });
//   }).catch((err) => {
//     console.log('Error retrieving registration token. ', err);
//     showToken('Error retrieving registration token. ', err);
//   });
// }

// // Add a message to the messages element.
// function appendMessage(payload) {
//   const messagesElement = document.querySelector('#messages');
//   const dataHeaderElement = document.createElement('h5');
//   const dataElement = document.createElement('pre');
//   dataElement.style = 'overflow-x:hidden;';
//   dataHeaderElement.textContent = 'Received message:';
//   dataElement.textContent = JSON.stringify(payload, null, 2);
//   messagesElement.appendChild(dataHeaderElement);
//   messagesElement.appendChild(dataElement);
// }

// // Clear the messages element of all children.
// function clearMessages() {
//   const messagesElement = document.querySelector('#messages');
//   while (messagesElement.hasChildNodes()) {
//     messagesElement.removeChild(messagesElement.lastChild);
//   }
// }

// function updateUIForPushEnabled(currentToken) {
//   showHideDiv(tokenDivId, true);
//   showHideDiv(permissionDivId, false);
//   showToken(currentToken);
// }

// function updateUIForPushPermissionRequired() {
//   showHideDiv(tokenDivId, false);
//   showHideDiv(permissionDivId, true);
// }

// resetUI();
// </script>



