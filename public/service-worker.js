// Importa le librerie Firebase necessarie per la gestione delle notifiche push.
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Inizializza Firebase con la configurazione specificata.
firebase.initializeApp({
    apiKey: "AIzaSyCet1Qe1GkNT3RN9HsbLC4QgWPVUF4BGNQ",
    authDomain: "travelbuddy-398213.firebaseapp.com",
    projectId: "travelbuddy-398213",
    storageBucket: "travelbuddy-398213.appspot.com",
    messagingSenderId: "834011206288",
    appId: "1:834011206288:web:6ab70dec3d3855c86c3e15",
    measurementId: "G-G9BRCRBKG3"
});

// Ottiene il servizio di messaggistica Firebase.
const messaging = firebase.messaging();

// Gestisce i messaggi in background quando arriva una notifica push.
messaging.onBackgroundMessage((payload) => {
    console.log('[service-worker.js] Received background message ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        title: notificationTitle,
        body: payload.notification.body
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Definisce il nome della cache e gli asset da memorizzare in essa.
const CACHE_NAME = 'cache-v4';
const assetsToCache = [
    "/service-worker.js",
    "/index.html",
    "/offline.html",
    "/logoTravelBuddy.png",
    "/logoTravelBuddy48.png",
    "/logoTravelBuddy72.png",
    "/logoTravelBuddy512.png",
    "/manifest.json",
    "/nointernetconnection.webp",
    "/static/media/PE2.b603ffd91f3230b9f8bd.jpg",
    "/static/media/DB1.88c0b0c79fc6a38672d0.jpg",
    "/static/media/IN1.b4ef28a8d8c5fd7a90fe.jpg",
    "/static/media/L1.fcce9a91b8ce75f0f070.jpg",
    "/static/media/DB2.7e7533d02503fc606803.jpg",
    "/static/media/IN2.cb4a0f0570a741ce0d90.jpg",
    "/static/media/L2.2589b1dcb336fddb9f5c.jpg",
    "/static/media/MorroneSimoneFototessera.e9309eff45cdc7d654fd.jpeg",
    "/static/media/NY1.3c0b2762cb4894e25056.jpg",
    "/static/media/NY2.db3d2f3176fd6525f090.jpg",
    "/static/media/P1.cb3eba53bafc57cc6ac9.jpg",
    "/static/media/P2.d9bec01f526e28daf027.jpg",
    "/static/media/PE1.defee7a3b77f6710732f.jpg",
    "/static/media/R1.9585fb8b0b78f7c0a74c.jpg",
    "/static/media/R2.b1440576eacd1a8b5124.jpg",
    "/static/media/SY1.603285f8e8704113afa5.jpg",
    "/static/media/SY2.161f04116c01e4e36b77.jpg",
    "/static/media/T1.5f09ea4de95f2aa1008c.jpg",
    "/static/media/T2.c7e47483eb42deb2859b.jpg",
    "/static/media/TK1.30954eb4e67e8fa8f534.jpg",
    "/static/media/TK2.6d50a9beb54000b72241.jpg",
    "/static/media/video1.00e3b4977bc3dd018537.mp4",
    "/static/media/video2.1763eeb63dcedd1911fc.mp4",
    "/static/media/video5.0e99a1c9631d6b31e336.mp4",
    "/static/media/video6.8c4b12ae43abb55a919f.mp4",
    "/static/media/video9.baae83e1445fc2d46f88.mp4",
    "/static/media/video10.3d36a3c0b311aeb47140.mp4"
];

// Gestisce l'evento di installazione del service worker.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aperta');
                return cache.addAll(assetsToCache);
            })
    );

    self.skipWaiting();
});

// Gestisce le richieste di fetch, cercando prima nella cache e quindi facendo una richiesta di rete.
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then(response => {
                // Controlla se la risposta è un file JS o CSS nella cartella /static/ e aggiunge la risposta alla cache.
                if (response.status === 200 && response.type === 'basic' &&
                    (event.request.url.includes('/static/css/') || event.request.url.includes('/static/js/') || event.request.url.includes('/static/media/') || event.request.url.includes('/')) ) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return response;
            }).catch(() => {
                // Fallback in caso di mancanza di connessione, restituendo una pagina offline.
                if (event.request.mode === 'navigate' || event.request.destination === 'document') {
                    return caches.match('/offline.html') || caches.match('/index.html');
                }
            });
        })
    );
});

// Gestisce l'evento di attivazione del service worker, eliminando le cache obsolete.
self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Gestisce l'evento di push, mostrando una notifica quando arriva una notifica push.
self.addEventListener('push', function (event) {
    const options = {
        body: event.data.text(),
        icon: './logoTravelBuddy48.png',
    };

    event.waitUntil(
        self.registration.showNotification('Notifica', options)
    );
});

// Gestisce l'evento di click su una notifica, aprendo una finestra. (ho messo google per un esempio)
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('https://www.google.com')
    );
});

// Gestisce il fetch delle richieste, cercando prima nella cache e quindi facendo una richiesta di rete.
async function handleFetch(request) {
    const response = await caches.match(request);
    return response || fetch(request).then(async fetchResponse => {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, fetchResponse.clone());
        return fetchResponse;
    });
}
