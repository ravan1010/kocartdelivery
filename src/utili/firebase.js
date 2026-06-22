
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB0mpaO9UQp-a1XLIWxvFme3VMB4H5LZLE",
  authDomain: "notification-to-branch.firebaseapp.com",
  projectId: "notification-to-branch",
  storageBucket: "notification-to-branch.firebasestorage.app",
  messagingSenderId: "513779357181",
  appId: "1:513779357181:web:617659c8e24e487dd3f594",
  measurementId: "G-K0Y7ZLNW9B"
};


const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
