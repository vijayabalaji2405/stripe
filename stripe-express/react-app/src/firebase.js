import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyCxhsJVVewCB_moqPEn_-BLAzzIfW2H2PA",
  authDomain: "stripe-d68cb.firebaseapp.com",
  projectId: "stripe-d68cb",
  storageBucket: "stripe-d68cb.appspot.com",
  messagingSenderId: "257166316155",
  appId: "1:257166316155:web:07494a5d3d1821fcaf08de",
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();
