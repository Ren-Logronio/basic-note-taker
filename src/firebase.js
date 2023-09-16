
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-analytics.js";
import { getFirestore, collection, query, where, getDocs, deleteDoc, addDoc, orderBy, updateDoc } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
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
let userImageHandle = null;

const liClass = "list-group-item list-group-item-action".split(/\s+/);
    const viewDivClass = "d-flex justify-content-between".split(/\s+/);
        const pClass = "h6 text-start align-self-center m-0 p-0".split(/\s+/);
        const divClass = "d-flex justify-content-end".split(/\s+/);
            const aEditClass = "ms-1 btn btn-outline-primary d-flex justify-center align-center".split(/\s+/);
            const aDeleteClass = "ms-1 btn btn-outline-danger d-flex justify-center align-center".split(/\s+/);
    const contentDivClass = "mt-2";
        const contentClass = "".split(/\s+/);


const noteTitleInput = document.querySelector('#note-title-input');
const noteContentInput = document.querySelector('#note-content-input');
const addNoteButton = document.querySelector('#add-note-button');
const addNoteAnchor = document.querySelector('#add-note-anchor');

const editNoteModal = document.querySelector('#edit-note-modal');
const editNoteIdInput = document.querySelector('#edit-note-id-input');
const editNoteTitleInput = document.querySelector('#edit-note-title-input');
const editNoteContentInput = document.querySelector('#edit-note-content-input');
const editNoteButton = document.querySelector('#edit-note-button');

const signinCard = document.querySelector('#signin-card');
const signoutCard = document.querySelector('#signout-card');
const googleSigninButton = document.querySelector('#google-signin-button');
const nameHolder = document.querySelector('#email-holder');
const googleSignoutButton = document.querySelector('#google-signout-button');
const homeHandle = document.querySelector('#home-handle');
const dashHandle = document.querySelector('#dash-handle');
const noteDash = document.querySelector('#note-dash');
const noteList = document.querySelector('#note-list');
const noteEmptyHandle = document.querySelector('#note-empty-handle');
const userHandle = document.querySelector('#user-handle');
const addCancel = document.querySelector('#add-cancel');
const editCancel = document.querySelector('#edit-cancel');

// check if signed in
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        signoutCard.classList.remove('d-none');
        dashHandle.classList.remove('d-none');
        noteDash.classList.remove('d-none');
        addNoteAnchor.classList.remove('d-none');
        if(!signinCard.classList.contains('d-none')) signinCard.classList.add('d-none');
        if(!homeHandle.classList.contains('d-none')) dashHandle.classList.add('d-none');
        
        userId = user.uid;

        const userProfilePicture = user.photoURL;
        const userProfileName = user.displayName;
        
        nameHolder.innerHTML = userProfileName;

        const userImage = document.createElement('img');
        userImage.src = userProfilePicture;
        userImage.classList.add('rounded-circle', 'me-2', 'align-self-center', 'mt-auto', 'mb-auto');
        userImage.style.width = '30px';
        userImage.style.height = '30px';

        userImageHandle = userImage;
        userHandle.insertBefore(userImage, userHandle.firstChild);

        // get notes
        reloadList();
    } else {
        signinCard.classList.remove('d-none');
        homeHandle.classList.remove('d-none');
        if(!addNoteAnchor.classList.contains('d-none')) addNoteAnchor.classList.add('d-none');
        if(!noteDash.classList.contains('d-none')) noteDash.classList.add('d-none');
        if(!dashHandle.classList.contains('d-none')) dashHandle.classList.add('d-none');
        if(!signoutCard.classList.contains('d-none')) signoutCard.classList.add('d-none');
        if(userImageHandle) {
            userImageHandle.remove()
            userImageHandle = null;
        }; 
        userId = null;
        console.log('not signed in');
    }
});

googleSignoutButton.addEventListener('click', ()=>{
    signOut(auth).then(() => {
        // Sign-out successful.
        console.log('signed out');
        signoutCard.classList.add('d-none');
        nameHolder.innerHTML = '';
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
        nameHolder.innerHTML = resultUser.displayName;

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
    // remove list element
    noteList.innerHTML = '';
    // re-query list
    const q = query(notesRef, orderBy("date", "desc"), where("uid", "==", userId));
    getDocs(q).then((querySnapshot) => {
        let notes = [];
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            notes.push(doc.data());
        });
        if(notes.length > 0){
            if(!noteEmptyHandle.classList.contains('d-none')) noteEmptyHandle.classList.add('d-none');
            appendLists(notes);
        } else {
            if(noteEmptyHandle.classList.contains('d-none')) noteEmptyHandle.classList.remove('d-none');
        }
    }).catch((error) => {
        console.log("Error getting documents: ", error);
    });
};

function appendToList(id, title, content) {
    const li = document.createElement('li');
    li.id = id;
    li.classList.add(...liClass);

    const viewDiv = document.createElement('div');
    viewDiv.classList.add(...viewDivClass);
    
    const p = document.createElement('p');
    p.classList.add(...pClass);
    p.innerHTML = title;
    
    const div = document.createElement('div');
    div.classList.add(...divClass);

    const aDelete = document.createElement('a');
    aDelete.addEventListener('click', ()=>{
        removeList(id);
    });
    aDelete.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/></svg>`;
    aDelete.classList.add(...aDeleteClass);

    const aEdit = document.createElement('a');
    aEdit.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>`;
    aEdit.classList.add(...aEditClass);
    aEdit.addEventListener('click', ()=>{
        editNote(id, title, content);
    });

    div.appendChild(aEdit);
    div.appendChild(aDelete);

    viewDiv.appendChild(p);
    viewDiv.appendChild(div);

    const contentDiv = document.createElement('div');
    contentDiv.classList.add(contentDivClass);

    const contentP = document.createElement('p');
    contentP.innerHTML = content;

    contentDiv.appendChild(contentP);

    li.appendChild(viewDiv);
    li.appendChild(contentDiv);

    noteList.appendChild(li);
}

function appendLists(notes){
    notes.forEach(note => {
        appendToList(note.id, note.title, note.content);
    });
}

function editNote (id, title, content){
    editNoteIdInput.value = id;
    editNoteTitleInput.value = title;
    editNoteContentInput.value = content;
    $('#edit-note-modal').modal('show');
}

function confirmEditNote(){
    const id = editNoteIdInput.value;
    const title = editNoteTitleInput.value;
    const content = editNoteContentInput.value;
    if(!title || !content || !id) {
        alert('Error: Title and or content cannot be empty');
        return;
    };
    if(userId){
        // edit note to firestore
        const note = {
            id: id,
            title: title,
            content: content,
            uid: userId
        };
        const q = query(notesRef, where("id", "==", id));
        getDocs(q).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                updateDoc(doc.ref, note).then(()=>{
                    // update note to list
                    reloadList();
                }).catch((error)=>{
                    console.log(error);
                    alert('Error updating note');
                });
            });
        }).catch((error) => {
            console.log("Error getting documents: ", error);
        });
    } else {
        console.log('not signed in');
    }
    editNoteIdInput.value = '';
    editNoteTitleInput.value = '';
    editNoteContentInput.value = '';
    $('#edit-note-modal').modal('hide');
}

function removeList(id){
    // delete note from firestore
    const q = query(notesRef, where("id", "==", id));
    getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            deleteDoc(doc.ref).then(()=>{
                console.log('note deleted');
                reloadList();
            }).catch((error)=>{
                console.log(error);
            });
        });
        // remove note from list
        document.getElementById(id).remove();
        // check if list is empty
        
    }).catch((error) => {
        console.log("Error getting documents: ", error);
    });
}

function addNote(){
    if(!noteTitleInput.value || !noteContentInput.value) {
        alert('Error: Title and or content cannot be empty');
        noteTitleInput.value = '';
        noteContentInput.value = '';
        return;
    };
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
            reloadList();
        }).catch((error)=>{
            console.log(error);
            alert('Error adding note');
        });
    } else {
        console.log('not signed in');
    }
    noteTitleInput.value = '';
    noteContentInput.value = '';
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
    editNoteButton.addEventListener('click', ()=>{ confirmEditNote(); });
    addCancel.addEventListener('click', ()=>{
        noteTitleInput.value = '';
        noteContentInput.value = '';
    });
    editCancel.addEventListener('click', ()=>{
        editNoteIdInput.value = '';
        editNoteTitleInput.value = '';
        editNoteContentInput.value = '';
    });
});

