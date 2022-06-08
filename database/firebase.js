import { getApp, initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCVlzP_Dt11WQr-b5xa6SC-mNxouC4IXlg",
  authDomain: "brindavan-student-app.firebaseapp.com",
  projectId: "brindavan-student-app",
  storageBucket: "brindavan-student-app.appspot.com",
  messagingSenderId: "312102316451",
  appId: "1:312102316451:web:f7a379ac062d6099d0d216",
  measurementId: "G-1MECRGQ12T",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
