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
  measurementId: "G-XHX5BTL43H",
});

const messaging = firebase.messaging();
