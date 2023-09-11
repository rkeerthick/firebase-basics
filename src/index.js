import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  where,
  orderBy,
} from "firebase/firestore";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  Unsubscribe
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAHM8ClHmO_eXaHVTpe49p4WM3XakfnTzY",
  authDomain: "fir-tutorial-practice-27406.firebaseapp.com",
  projectId: "fir-tutorial-practice-27406",
  storageBucket: "fir-tutorial-practice-27406.appspot.com",
  messagingSenderId: "229624108497",
  appId: "1:229624108497:web:0623d30885d8c8a0a43cf0",
};

// init firebase app
initializeApp(firebaseConfig);

// init service
const db = getFirestore();
const auth = getAuth();

// collection ref
const colRef = collection(db, "books");

// query
const q = query(colRef, orderBy("createdAt"));

// get realtime data
const unsubCol = onSnapshot(q, (snapshot) => {
  let books = [];
  //   console.log(snapshot.docs);
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });
  console.log(books);
});

const addBook = document.querySelector(".add");
addBook.addEventListener("submit", (event) => {
  event.preventDefault();
  addDoc(colRef, {
    title: addBook.title.value,
    author: addBook.author.value,
    createdAt: serverTimestamp(),
  }).then(() => addBook.reset());
});

const deleteBook = document.querySelector(".delete");
deleteBook.addEventListener("submit", (event) => {
  event.preventDefault();

  const delRef = doc(db, "books", deleteBook.id.value);

  deleteDoc(delRef).then(() => deleteBook.reset());
});

const docRef = doc(db, "books", "m1F7RdejIywDRwHVnk6r");

getDoc(docRef)
  .then((doc) => console.log(doc.data(), doc.id))
  .catch((err) => console.log(err));

const unsubDoc = onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id);
});

const updateBook = document.querySelector(".update");
updateBook.addEventListener("submit", (event) => {
  event.preventDefault();

  const updtDoc = doc(db, "books", updateBook.id.value);

  updateDoc(updtDoc, {
    title: "updated title",
  }).then(() => {
    updateBook.reset();
  });
});

const signup = document.querySelector(".signup");
signup.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = signup.email.value;
  const password = signup.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      // console.log("User created : ", cred.user);
      signup.reset();
    })
    .catch((err) => {
      console.log(err);
    });
});

const login = document.querySelector(".login");
login.addEventListener("submit", (event) => {
  event.preventDefault();
  
  const email = login.email.value;
  const password = login.password.value;
  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      // console.log("user logged in : " , cred.user);
    })
    .catch((err) => {
      console.log(err.message);
    })
});

const logout = document.querySelector(".logout");
logout.addEventListener("click", (event) => {
  event.preventDefault();
  signOut(auth)
    .then(() => {
      // console.log("Signed out");
    })
    .catch((err) => console.log(err.message))
});


const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log("User status changed : " , user);
})

const unsub = document.querySelector(".unsubcribe")
unsub.addEventListener('click', () => {
  console.log("Unsubscribing....")
  unsubCol();
  unsubDoc();
  unsubAuth();
})