import { initializeApp } from "firebase/app";

import { getAuth, signInWithCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail, sendEmailVerification, updateEmail, reauthenticateWithCredential, EmailAuthProvider, GoogleAuthProvider, signInWithPopup }
from "firebase/auth";

import { getFirestore, collection, doc, setDoc, addDoc, getDocs, getDoc, updateDoc, onSnapshot, query, where, orderBy, deleteDoc, increment, arrayUnion, arrayRemove, deleteField, collectionGroup }
from "firebase/firestore";

import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll, uploadBytesResumable }
from "firebase/storage";

// FIREBASE

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

//FirebaseAuth exports
export { auth, provider, getAuth, signInWithCredential, createUserWithEmailAndPassword, updateEmail, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail, sendEmailVerification, app, reauthenticateWithCredential, EmailAuthProvider, GoogleAuthProvider, signInWithPopup };

//Firestore exports
export { db, doc, collection, setDoc, addDoc, getDocs, getDoc, updateDoc, where, query, onSnapshot, orderBy, deleteDoc, increment, arrayUnion, arrayRemove, deleteField, collectionGroup };

//FirebaseStorage exports
export { storage, ref, uploadBytes, getDownloadURL, deleteObject, listAll, uploadBytesResumable };
