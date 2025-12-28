// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCS9sn6Szm5MZHeKTjwN52mxSTYhNKmRmU",
  authDomain: "musu-food.firebaseapp.com",
  projectId: "musu-food",
  storageBucket: "musu-food.firebasestorage.app",
  messagingSenderId: "937547096615",
  appId: "1:937547096615:web:273a41c160c31d5f0c2402",
  measurementId: "G-XSYGYDSK5L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);