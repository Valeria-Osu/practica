// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1foCs42eSzw_UvSPY2wqcBlHKBj8Jxiw",
  authDomain: "proyecto-cafeterias.firebaseapp.com",
  projectId: "proyecto-cafeterias",
  storageBucket: "proyecto-cafeterias.firebasestorage.app",
  messagingSenderId: "149481740342",
  appId: "1:149481740342:web:bbef384fd794ed42d9e097"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


export { auth };