importScripts('https://www.gstatic.com/firebasejs/9.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.13.0/firebase-messaging-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.13.0/firebase-analytics-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB6MbPLjt0r9NrCfasAs3aOA2zXZcAS1h4",
  authDomain: "toanlefirebase.firebaseapp.com",
  projectId: "toanlefirebase",
  storageBucket: "toanlefirebase.appspot.com",
  messagingSenderId: "743574831100",
  appId: "1:743574831100:web:d26a6a84d7c3b8fc0f3c79",
  measurementId: "G-87WC6HQ2F7"
});

const messaging = firebase.messaging();
