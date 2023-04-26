/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/9.8.4/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.8.4/firebase-messaging-compat.js");

// Get registration token. Initially this makes a network call, once retrieved
const firebaseConfig = {
  apiKey: 'AIzaSyB2fnPhZ5X6SvzZInsNdpmFghRsRzfxwug ',
  authDomain: 'ecomarket-2023.firebaseapp.com',
  projectId: 'ecomarket-2023',
  storageBucket: 'ecomarket-2023.appspot.com',
  messagingSenderId: "68343441385",
  appId: "1:68343441385:web:31bd0efd0fc83ac7be8d78",
  measurementId: "G-8C73THQN94"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging(app);

messaging.onBackgroundMessage(payload => {
  console.log("Recibiste mensaje mientras estabas ausente");
// previo a mostrar notificación
  const notificationTitle= payload.notification.title;
  const notificationOptions = {
      body: payload.notification.body,
      icon: "/logo192.png"
  }


  return self.registration.showNotification(
      notificationTitle, 
      notificationOptions
  )
})