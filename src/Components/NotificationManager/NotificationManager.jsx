import { useEffect, useState } from 'react';
import { onMessage } from 'firebase/messaging';
import { getNotificationToken } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, messaging } from '../../firebase';
import { getAuth } from 'firebase/auth';
import toast, { Toaster } from 'react-hot-toast';

const NotificationManager = () => {
    const auth = getAuth();
    const [notificationPermission, setNotificationPermission] = useState('default');

    useEffect(() => {
        requestNotificationPermission();
        listenForForegroundNotifications();
    }, []);

    useEffect(() => {
        const unsubscribe = onMessage(messaging, (payload) => {
            console.log('Messaggio ricevuto in foreground:', payload);
            // Mostra la notifica usando react-hot-toast o un'altra libreria
            toast(`${payload.notification.title}: ${payload.notification.body}`);
        });
    
        return unsubscribe; // Questo assicura la rimozione del listener quando il componente viene smontato
    }, []);
    

    const requestNotificationPermission = async () => {
        if (!auth.currentUser) {
            console.error('Utente non autenticato');
            return;
        }

        if (!('Notification' in window)) {
            console.error('Questo browser non supporta le notifiche desktop');
            return;
        }

        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);

        if (permission === 'granted') {
            const token = await getTokenForUser();
            if (!token) {
                subscribeUserToPushNotifications();
            }
        }
    };

    const getTokenForUser = async () => {
        const userEmail = auth.currentUser?.email;
        if (userEmail) {
            const tokenDocRef = doc(db, 'tokens', userEmail);
            const tokenSnapshot = await getDoc(tokenDocRef);
            return tokenSnapshot.exists() ? tokenSnapshot.data().token : null;
        }
        return null;
    };

    const subscribeUserToPushNotifications = async () => {
        if (!auth.currentUser) {
            console.error('Utente non autenticato');
            return;
        }

        const userEmail = auth.currentUser.email;
        const currentToken = await getNotificationToken(userEmail);
        if (currentToken) {
            // Costruisci l'URL per sottoscrivere l'utente all'argomento 'allUsers'
            const subscribeUrl = `https://iid.googleapis.com/iid/v1/${currentToken}/rel/topics/allUsers`;

            // Invia una richiesta POST per sottoscrivere l'utente all'argomento
            const response = await fetch(subscribeUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer c65tPk6cKrAuHMj9AkxHbt:APA91bH63JpC_hTE0APbr86eJp31DnDHDpALZV1HsBH6fe8zCMTzvsyt76rWKIu8AJ2C9_Qlj98gS64X729pzikicqUa4L9oB95BEdxZjXiWwAxCbETD4lEzxghCJxFFKnR0RJr6sIF3', 
                },
            });

            if (response.status === 200) {
                console.log('Utente iscritto all\'argomento "allUsers"');
            } else {
                console.error('Errore durante l\'iscrizione dell\'utente all\'argomento. Stato:', response.status);
            }

            console.log('Token di notifica push ottenuto:', currentToken);
            await saveTokenToFirestore(currentToken);
        } else {
            console.log('Nessun token di registrazione disponibile.');
        }
    }




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

    const listenForForegroundNotifications = () => {
        onMessage(messaging, (payload) => {
            console.log('Messaggio push ricevuto in primo piano: ', payload);
            toast(payload.notification.title + ': ' + payload.notification.body);
        });
    };

    return <Toaster />;
};

export default NotificationManager;
