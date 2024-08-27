// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvMoUz0cPIcz_X5KtFB7lvTyO-9HIAk64",
  authDomain: "astro-d4909.firebaseapp.com",
  projectId: "astro-d4909",
  storageBucket: "astro-d4909.appspot.com",
  messagingSenderId: "552636560911",
  appId: "1:552636560911:web:273bac353781fecf5a557a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const projectAuth = getAuth(app);
