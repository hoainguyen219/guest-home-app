// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyDU5RNX3XywQnSD8e-818OD17Dq4WUyVl4",
  authDomain: "chat-angular-a9217.firebaseapp.com",
  databaseURL: "https://chat-angular-a9217-default-rtdb.firebaseio.com",
  projectId: "chat-angular-a9217",
  storageBucket: "chat-angular-a9217.appspot.com",
  messagingSenderId: "1065251336433",
  appId: "1:1065251336433:web:e5c5a5d108d20db2777950",
  measurementId: "G-1JNXZ34RFV",

});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();