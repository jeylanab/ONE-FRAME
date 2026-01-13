import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCsbh9_85jsfl2Fdh2k1F0DpI_bBwe3FhQ",
  authDomain: "new-frame-a04d9.firebaseapp.com",
  projectId: "new-frame-a04d9",
  storageBucket: "new-frame-a04d9.appspot.com",
  messagingSenderId: "801277766968",
  appId: "1:801277766968:web:3f9c066cd34f8fd92e65cd"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
