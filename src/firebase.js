
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCXAXjzHrp9nIVAHZg74upylZfKDzZ_sVs",
    authDomain: "note-taking-3cdd3.firebaseapp.com",
    projectId: "note-taking-3cdd3",
    storageBucket: "note-taking-3cdd3.appspot.com",
    messagingSenderId: "551452159307",
    appId: "1:551452159307:web:6aa351e0b269f8351c0cce",
    measurementId: "G-J6PDRJJ2F7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// test if connected
console.log(db);