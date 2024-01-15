// Importa le funzioni e librerie necessarie da Firebase per l'autenticazione e Firestore.
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { db } from '../firebase'
import { collection } from 'firebase/firestore'

// Inizializza l'oggetto 'auth' per gestire l'autenticazione degli utenti.
const auth = getAuth()

// Ottiene un riferimento alla collezione 'users' nel database Firestore.
const usersCollectionRef = collection(db, "users")

// Funzione per effettuare il login di un utente utilizzando Firebase Authentication.
export const loginUser = async (email, password) => {
  try {
    // Effettua il login con l'email e la password fornite utilizzando 'signInWithEmailAndPassword'.
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Restituisce l'oggetto 'user' rappresentante l'utente autenticato.
    return userCredential.user
  } catch (error) {
    // Gestisce eventuali errori e li lancia nuovamente.
    throw error;
  }
}

// Funzione per effettuare il logout di un utente autenticato.
export const logoutUser = async () => {
  try {
    // Esegue il logout dell'utente autenticato utilizzando 'signOut'.
    await signOut(auth);
  } catch (error) {
    // Gestisce eventuali errori e li lancia nuovamente.
    throw error;
  }
}
