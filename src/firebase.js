
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-analytics.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
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
const notesRef = collection(db, 'notes');
let userId = null;
let user = null;

const liClass = "list-group-item list-group-item-action d-flex justify-content-between".split(/\s+/);
const pClass = "h6 text-start align-self-center m-0 p-0".split(/\s+/);
const divClass = "d-flex justify-content-end".split(/\s+/);
const aDeleteClass = "ms-1 btn btn-outline-danger d-flex justify-center align-center".split(/\s+/);

const noteTitleInput = document.querySelector('#note-title-input');
const noteContentInput = document.querySelector('#note-content-input');
const addNoteButton = document.querySelector('#add-note-button');

const signinCard = document.querySelector('#signin-card');
const signoutCard = document.querySelector('#signout-card');
const googleSigninButton = document.querySelector('#google-signin-button');
const emailHolder = document.querySelector('#email-holder');
const googleSignoutButton = document.querySelector('#google-signout-button');
const homeHandle = document.querySelector('#home-handle');
const dashHandle = document.querySelector('#dash-handle');
const noteDash = document.querySelector('#note-dash');
const noteList = document.querySelector('#note-list');
const noteEmptyHandle = document.querySelector('#note-empty-handle');

// check if signed in
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        signoutCard.classList.remove('d-none');
        dashHandle.classList.remove('d-none');
        if(!signinCard.classList.contains('d-none')) signinCard.classList.add('d-none');
        if(!homeHandle.classList.contains('d-none')) dashHandle.classList.add('d-none');
        emailHolder.innerHTML = user.email;
        userId = user.uid;

        // get notes
        const q = query(notesRef, where("uid", "==", user.uid));
        getDocs(q).then((querySnapshot) => {
            let notes = [];
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                notes.push(doc.data());
            });
            if(notes.length > 0){
                if(!noteEmptyHandle.classList.contains('d-none')) noteEmptyHandle.classList.add('d-none');
                appendLists(notes);
            }
        }).catch((error) => {
            console.log("Error getting documents: ", error);
        });
    } else {
        signinCard.classList.remove('d-none');
        homeHandle.classList.remove('d-none');
        if(!noteDash.classList.contains('d-none')) noteDash.classList.add('d-none');
        if(!dashHandle.classList.contains('d-none')) dashHandle.classList.add('d-none');
        if(!signoutCard.classList.contains('d-none')) signoutCard.classList.add('d-none');
        userId = null;
        console.log('not signed in');
    }
});

googleSignoutButton.addEventListener('click', ()=>{
    signOut(auth).then(() => {
        // Sign-out successful.
        console.log('signed out');
        signoutCard.classList.add('d-none');
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
        user = resultUser;
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

function reloadList(){
    // re-query list
    const q = query(notesRef, where("uid", "==", userId));
    getDocs(q).then((querySnapshot) => {
        let notes = [];
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            notes.push(doc.data());
        });
        if(notes.length > 0){
            if(!noteEmptyHandle.classList.contains('d-none')) noteEmptyHandle.classList.add('d-none');
            appendLists(notes);
        }
    }).catch((error) => {
        console.log("Error getting documents: ", error);
    });
};

function appendToList(id, title) {
    let li = document.createElement('li');
    li.id = id;
    li.classList.add(...liClass);
    
    let p = document.createElement('p');
    p.classList.add(...pClass);
    p.innerHTML = title;
    
    let div = document.createElement('div');
    div.classList.add(...divClass);

    let aDelete = document.createElement('a');
    aDelete.addEventListener('click', ()=>{
        removeList(id);
    });
    aDelete.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/></svg>`;
    aDelete.classList.add(...aDeleteClass);

    div.appendChild(aDelete);

    li.appendChild(p);
    li.appendChild(div);

    noteList.appendChild(li);
}

function appendLists(notes){
    notes.forEach(note => {
        appendToList(note.id, note.title);
    });
}

function removeList(id){
    // delete note from firestore
    const q = query(notesRef, where("id", "==", id));
    getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            deleteDoc(doc.ref);
        });
        // remove note from list
        document.getElementById(id).remove();
        // check if list is empty
        reloadList();
    }).catch((error) => {
        console.log("Error getting documents: ", error);
    });
}

function addNote(){
    if(userId){
        // add note to firestore
        const noteId = create_UUID();
        const noteTitle = noteTitleInput.value;
        const noteContent = noteContentInput.value;
        const date = new Date();
        const unixGetTime = Math.floor(date.getTime() / 1000);
        const note = {
            id: noteId,
            title: noteTitle,
            content: noteContent,
            date: unixGetTime,
            uid: userId
        };
        addDoc(notesRef, note).then(()=>{
            // add note to list
            appendToList(noteId, noteTitle);
        }).catch((error)=>{
            console.log(error);
            alert('Error adding note');
        });
    } else {
        console.log('not signed in');
    }
}

function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'notes-xxxx-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

document.addEventListener('DOMContentLoaded', ()=>{
    addNoteButton.addEventListener('click', ()=>{ addNote(); });
});

