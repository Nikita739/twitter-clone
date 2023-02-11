import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore'
import 'firebase/auth'

// Please do not break my DB
const firebaseConfig = {
    apiKey: "AIzaSyBZpw60-NOZgNYqU2unh7Gqg5Wxb91COeM",
    authDomain: "social-network-47b5a.firebaseapp.com",
    projectId: "social-network-47b5a",
    storageBucket: "social-network-47b5a.appspot.com",
    messagingSenderId: "462825518663",
    appId: "1:462825518663:web:5c40f9161797c3112da362",
    measurementId: "G-F6TZNDD5HN"
};

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
