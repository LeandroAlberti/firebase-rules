// firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";

const firebase = initializeApp({ 
    apiKey: "AIzaSyCp8SURl50TMtzVeRor6EUpsntnmB9DWdM",
    authDomain: "hello-firebase-96494.firebaseapp.com",
    databaseURL: "https://hello-firebase-96494-default-rtdb.firebaseio.com",
}, 'firebase-rules-users');

// database
import { getDatabase, ref, onValue, push, set, update, child, get } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js";

const bd = getDatabase(firebase);

export { bd, ref, onValue, push, set, update, child, get }

// auth
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js";

const auth = getAuth(firebase);

export { auth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword }