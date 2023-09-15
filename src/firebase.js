
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
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
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const auth = getAuth();
auth.languageCode = 'it';

const signinCard = document.querySelector('#signin-card');
const signoutCard = document.querySelector('#signout-card');
const googleSigninButton = document.querySelector('#google-signin-button');
const emailHolder = document.querySelector('#email-holder');
const googleSignoutButton = document.querySelector('#google-signout-button');

// check if signed in
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        signoutCard.classList.remove('d-none');
        if(!signinCard.classList.contains('d-none')) signinCard.classList.add('d-none');
        emailHolder.innerHTML = user.email;
    } else {
        signinCard.classList.remove('d-none');
        if(!signoutCard.classList.contains('d-none')) signoutCard.classList.add('d-none');
        console.log('not signed in');
    }
});

googleSignoutButton.addEventListener('click', ()=>{
    signOut(auth).then(() => {
        // Sign-out successful.
        console.log('signed out');
        signoutCard.classList.add('d-none');
        document.cookie = JSON.stringify({token: '', user: ''});
        emailHolder.innerHTML = '';
        signout
    }).catch((error) => {
        // An error happened.
        console.log(error);
    });
});

googleSigninButton.addEventListener('click', ()=>{
    // sign in to google
    signInWithPopup(auth, provider).then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const resultToken = credential.accessToken;
        const resultUser = result.user;
        document.cookie = JSON.stringify({token: `${resultToken}`, user: resultUser});
        // The signed-in user info.
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        // alert user welcom
        emailHolder.innerHTML = resultUser.email;

    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(`${errorCode} - ${errorMessage}`)
        // ...
    });
});
