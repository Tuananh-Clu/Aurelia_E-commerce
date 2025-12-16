
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
    apiKey:"AIzaSyC-9oy12XrTBRccrwxVzolBswIq--0qqF0",
    authDomain: "aurelia-e-commerce.firebaseapp.com",
    projectId: "aurelia-e-commerce",
    storageBucket: "aurelia-e-commerce.firebasestorage.app",
    messagingSenderId: "570455783966",
    appId: "1:570455783966:web:2d5b54eef603b3c291cc0f",
    measurementId: "G-KP8J8CWDFS"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth=getAuth(firebaseApp);
export const GoogleProvider = new GoogleAuthProvider();
export default firebaseConfig;