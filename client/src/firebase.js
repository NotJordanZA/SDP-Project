// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCbdIZYHInEVMi7cFjt75mBQitj9KCZb9U",
  authDomain: "wits-infrastructure-management.firebaseapp.com",
  projectId: "wits-infrastructure-management",
  storageBucket: "wits-infrastructure-management.appspot.com",
  messagingSenderId: "345175411625",
  appId: "1:345175411625:web:94d3e7f252f9ffc4ca12b8",
  measurementId: "G-56XZRZ4RYP"
};

// Initialize Firebase
export {firebaseConfig}
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db =  getFirestore(app);