import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { db } from '../firebase'
import { collection } from 'firebase/firestore'

const auth = getAuth()
const usersCollectionRef = collection(db, "users")

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user
  } catch (error) {
    throw error;
  }
}

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
}
