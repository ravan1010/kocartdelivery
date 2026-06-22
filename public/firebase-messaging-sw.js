importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js");


const firebaseConfig = {
  apiKey : "AIzaSyB0mpaO9UQp-a1XLIWxvFme3VMB4H5LZLE",
  authDomain: "notification-to-branch.firebaseapp.com",
  projectId: "notification-to-branch",
  storageBucket: "notification-to-branch.firebasestorage.app",
  messagingSenderId: "513779357181",
  appId: "1:513779357181:web:617659c8e24e487dd3f594",
  measurementId: "G-K0Y7ZLNW9B"
};

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('firebase notification :', payload)
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
  });
});