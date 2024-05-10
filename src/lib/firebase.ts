import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "devaztalk.firebaseapp.com",
  projectId: "devaztalk",
  storageBucket: "devaztalk.appspot.com",
  messagingSenderId: "1041057000343",
  appId: "1:1041057000343:web:b3984511ab75909a5272d2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()