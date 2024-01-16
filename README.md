Ho provato a gestire le notifiche push con FCM, ci sono i dettagli nei codici: 

    1) NotificationManager.jsx: mi gestisce la generazione dei token, importanto la funzione dal file di configurazione firebase.js
    2) Service-worker.js: gestisco il service-worker per l'evento push (anche per la cache) e i messaggi in background
    3) firebase.js: c'è la logica dei token
    4) Main.jsx: qui dovrebbe inviare una richiesta al server FCM per poi l'invio delle notifiche a tutti gli utenti, dato che l'idea è che quando un utente inserisce una nuova 
        esperienza il sistema notifica tutti gli utenti che quell'utente ha inserito una nuova esperienza.
    N.B. I token vengono generati correttamente, vengono salvati nel db. Le richieste POST per FCM vanno a buon fine (status 200 ok), e mi prende correttamente i token degli utenti
        che hanno almeno una volta consentito le notifiche.

    Il problema sta nella visualizzazione. ho avuto questo problema e data la scadenza imminente non ho avuto più tempo per risolverne.


////////////////////////////////////////////////////////////////////////// DESCRIZIONE DEL PROGETTO  ///////////////////////////////////////////////////////////////////////////
- Titolo: TravelBuddy
- Descrizione: TravelBuddy è una Web App che aiuta gli appassionati di viaggi a pianificare e condividere le loro avventure in tutto il mondo. La piattaforma consente agli utenti di creare un account, pianificare i loro viaggi, condividere le loro esperienze con gli amici e tenersi aggiornati sulle attrazioni, ristoranti ed hotel grazie alle API di Google Maps. 
- Caratteristiche:
    •  Front-end dinamico: uso il framework React per creare un'interfaccia utente intuitiva ereattiva.
    • Autenticazione degli utenti: Implemento un sistema di autenticazione per consentire agli utenti di registrarsi, effettuare l'accesso e gestire i loro profili. Utilizzo firebase.
    • Integrazione con API esterne: Collego l'app a un'API esterna che fornisce dati su destinazioni, attrazioni turistiche, ristoranti ed hotel. 
    • Questi dati possono arricchire le informazioni disponibili per gli utenti durante la pianificazione dei viaggi. Utilizzo nello specifico RapidApi.
    • Integrazione con Firestore: Utilizzo Firestore per memorizzare i dati degli utenti le esperienze condivise, le recensioni e i preferiti in diverse collezioni. Ciò permette agli utenti di accedere alle loro informazioni da qualsiasi dispositivo. 
    • Progressive Web App (PWA):
        • Installabile: Permetto agli utenti di installare l'app sul loro dispositivo, in modo che possa essere accessibile dalla schermata iniziale come un'app nativa.
        • Utilizzo Offline: Implemento la funzionalità di caching per consentire agli utenti di accedere alle informazioni e ai dati precedenti anche quando sono offline. In pratica se si ha effettuato l’accesso e alcuni dati sono stati caricati in cache allora verrano mostrati quei dati, altrimenti verrà visualizzato un messaggio di errore. Per la mappa di google maps verrà sempre visualizzato un messaggio di errore dato che in cache non si può memorizzare nulla.
    
    
/////////////////////////////////////////////////////////////// QUI HO AVUTO DEI PROBLEMI MENZIONATI SU ////////////////////////////////////////////////////////////////////////////////////
    • Notifiche:
        • Notifiche Web: Implemento le notifiche push tramite il servizio Firebase Cloud Messaging per fornire agli utenti aggiornamenti sui loro viaggi, nuove destinazioni popolari. 
     
