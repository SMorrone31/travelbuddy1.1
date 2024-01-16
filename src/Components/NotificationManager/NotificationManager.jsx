import { useEffect, useState } from 'react';
import { onMessage } from 'firebase/messaging';
import { getNotificationToken } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, messaging } from '../../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import toast, { Toaster } from 'react-hot-toast';

const NotificationManager = () => {
    const auth = getAuth();
    const [notificationPermission, setNotificationPermission] = useState('default');

    // Questa funzione richiede il permesso per inviare notifiche desktop.
    const requestNotificationPermission = async () => {
        // Verifica se il browser supporta le notifiche desktop.
        if (!('Notification' in window)) {
            console.error('Questo browser non supporta le notifiche desktop');
            return;
        }

        // Richiede il permesso all'utente per inviare notifiche.
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission); // Aggiorna lo stato del permesso.

        // Se l'utente ha concesso il permesso, ottiene un token per le notifiche push.
        if (permission === 'granted') {
            const token = await getTokenForUser();
            if (!token) {
                // Se l'utente non ha un token, sottoscrive l'utente alle notifiche push.
                subscribeUserToPushNotifications();
            }
        }
    };

    // Questa funzione ottiene il token per le notifiche push associato all'utente attualmente connesso.
    const getTokenForUser = async () => {
        // Ottiene l'email dell'utente attualmente connesso.
        const userEmail = auth.currentUser?.email;

        if (userEmail) {
            // Ottiene il riferimento al documento del token nell'archivio Firestore.
            const tokenDocRef = doc(db, 'tokens', userEmail);

            // Ottiene lo snapshot del documento del token.
            const tokenSnapshot = await getDoc(tokenDocRef);

            // Restituisce il token se esiste, altrimenti restituisce null.
            return tokenSnapshot.exists() ? tokenSnapshot.data().token : null;
        }

        // Restituisce null se l'utente non è connesso o se non ha un'email.
        return null;
    };


    // Funzione per sottoscrivere l'utente alle notifiche push e salvare il token nel Firestore.
    const subscribeUserToPushNotifications = async () => {
        if (!auth.currentUser) {
            console.error('Utente non autenticato');
            return;
        }

        const userEmail = auth.currentUser.email;
        const currentToken = await getNotificationToken(userEmail);

        if (currentToken) {
            // Token di notifica push trovato, quindi lo salviamo nel Firestore.
            await saveTokenToFirestore(currentToken);
            console.log('Token di notifica push salvato nel Firestore:', currentToken);
        } else {
            console.log('Nessun token di registrazione disponibile.');
        }
    }

    // Funzione per salvare il token nel Firestore.
    const saveTokenToFirestore = async (token) => {
        const userEmail = auth.currentUser?.email;
        if (userEmail) {
            const tokenDocRef = doc(db, 'tokens', userEmail);
            try {
                await setDoc(tokenDocRef, { email: userEmail, token });
                console.log('Token salvato nel Firestore');
            } catch (error) {
                console.error('Errore nel salvare il token nel Firestore', error);
            }
        }
    };

    // Funzione per ascoltare le notifiche in primo piano.
    const listenForForegroundNotifications = () => {
        onMessage(messaging, (payload) => {
            console.log('Messaggio push ricevuto in primo piano: ', payload);
            const notificationMessage = `${payload.notification.title}: ${payload.notification.body}`;
            alert(notificationMessage); // Utilizza alert per mostrare le notifiche.
        });
    };


    useEffect(() => {
        const unsubscribe = listenForForegroundNotifications();
        return () => {
            unsubscribe(); // Assicura di rimuovere il listener quando il componente viene smontato
        };
    }, []);

    // Questo useEffect gestisce le notifiche quando un utente effettua l'accesso o il logout.
    useEffect(() => {
        // Crea un listener per l'evento di cambio dello stato di autenticazione.
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Se l'utente è autenticato, richiedi il permesso per le notifiche.
                await requestNotificationPermission();
            } else {
                // Se l'utente effettua il logout, ripristina il consenso per le notifiche.
                setNotificationPermission('default');
            }
        });

        // Assicura la rimozione del listener quando il componente viene smontato.
        return unsubscribe;
    }, [auth]); // Dipendenza dell'effetto: viene eseguito quando 'auth' cambia.



    return null;
};

export default NotificationManager;
