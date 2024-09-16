import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyALhSAxqow4E7xScZ0pTVtTGgpZt_a1kTI",
    authDomain: "expense-tracker-86f95.firebaseapp.com",
    projectId: "expense-tracker-86f95",
    storageBucket: "expense-tracker-86f95.appspot.com",
    messagingSenderId: "476797876242",
    appId: "1:476797876242:web:7c4424aaf3110a649f00cb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { signInWithEmailAndPassword, createUserWithEmailAndPassword };
export default app;