// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDCt1K5EDjXkEq7f7v1IrSCgMUBu7yWvXI',
  authDomain: 'mercaius-7f9bd.firebaseapp.com',
  projectId: 'mercaius-7f9bd',
  storageBucket: 'mercaius-7f9bd.appspot.com',
  messagingSenderId: '724624906764',
  appId: '1:724624906764:web:889e2fd90ae858b0b76c29',
  measurementId: 'G-RB9N0LPDJ9',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
