// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyA11TRZK5wMih4Q8KOUl4MO61PT0DD3g8M",
    authDomain: "whatsapp-clone-66095.firebaseapp.com",
    projectId: "whatsapp-clone-66095",
    storageBucket: "whatsapp-clone-66095.appspot.com",
    messagingSenderId: "602686895184",
    appId: "1:602686895184:web:bd23d00a9c91b18e590d55",
    measurementId: "G-R62EBCFRLG"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db=firebaseApp.firestore();
const auth=firebase.auth();
const provider= new firebase.auth.GoogleAuthProvider();

export {auth, provider};
export default db;