// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4t-Dynsu-Fzkzcin9wJe_d8xvUdfAmFw",
  authDomain: "chefpro-87e0d.firebaseapp.com",
  projectId: "chefpro-87e0d",
  storageBucket: "chefpro-87e0d.firebasestorage.app",
  messagingSenderId: "992083816030",
  appId: "1:992083816030:web:d7f46740c747bfee5c0ecf",
  measurementId: "G-6KXYSS0W1X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);