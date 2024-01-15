
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, onMessage, getToken } from "firebase/messaging";
import { getFirestore } from "firebase/firestore";

// Configurazione Firebase con le chiavi API e altri dettagli.
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

// Inizializza l'app Firebase con la configurazione definita.
const app = initializeApp(firebaseConfig);

// Ottieni l'oggetto di analytics per monitorare l'utilizzo dell'app (facoltativo).
const analytics = getAnalytics(app);

// Ottieni l'oggetto di messaging per gestire le notifiche push.
const messaging = getMessaging(app);

// Ottieni l'oggetto del database Firestore per l'accesso al database.
const db = getFirestore(app);

// Esporta le variabili per l'utilizzo in altri moduli.
export { app, analytics, messaging, db };

// Definisce una funzione per ottenere il token di notifica push per un utente specifico.
export const getNotificationToken = async (userEmail) => {
  try {
    // Ottieni il token di notifica push utilizzando Firebase Cloud Messaging (FCM).
    const currentToken = await getToken(messaging, {
      vapidKey: 'BEn4VtLxYD9n7u8Oop4Qm5KKG_OxmU43PuCk9dcXEipff-a5yPWqMvj-zPKEUfJmcMrBEH_bSl6mUkIrZn8_Jzg',
    });
     // Verifica se il token è stato ottenuto con successo.
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
