
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, onMessage, getToken } from "firebase/messaging";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
const firebaseConfig = {
  apiKey: "AIzaSyCet1Qe1GkNT3RN9HsbLC4QgWPVUF4BGNQ",
  authDomain: "travelbuddy-398213.firebaseapp.com",
  databaseURL: "https://travelbuddy-398213-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "travelbuddy-398213",
  storageBucket: "travelbuddy-398213.appspot.com",
  messagingSenderId: "834011206288",
  appId: "1:834011206288:web:6ab70dec3d3855c86c3e15",
  measurementId: "G-G9BRCRBKG3"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app)
const db = getFirestore(app);

export { app, analytics, messaging, db };

export const getNotificationToken = async (userEmail) => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: 'BEn4VtLxYD9n7u8Oop4Qm5KKG_OxmU43PuCk9dcXEipff-a5yPWqMvj-zPKEUfJmcMrBEH_bSl6mUkIrZn8_Jzg',
    });
    if (currentToken) {
      console.log('Token di notifica push ottenuto:', currentToken);
      return currentToken;
    } else {
      console.log('Nessun token di registrazione disponibile.');
      return null;
    }
  } catch (error) {
    console.error('Errore nell\'ottenere il token', error);
    return null;
  }
};
