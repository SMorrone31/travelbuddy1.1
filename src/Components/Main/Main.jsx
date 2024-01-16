import React, { useEffect, useState, useMemo } from "react"
import './main.css'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import { useAuth } from "../../AuthContext"
import { db } from "../../firebase"
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore"
import Select from "react-select"
import countryList from "react-select-country-list"
import Modal from 'react-modal'
import { BsUpload } from "react-icons/bs"
import { AiOutlineDelete, AiOutlineInfoCircle } from "react-icons/ai"
import { BsFillSuitHeartFill } from "react-icons/bs"
import { v4 as uuidv4 } from 'uuid'
import { notification, Modal as AntModal, Button, Skeleton } from 'antd'
import "../PlaceDetails/placeDetails.css"
import { messaging } from "../../firebase"

// Imposta l'elemento radice dell'applicazione per il componente Modal

Modal.setAppElement('#root')

const Main = () => {
    // Estrai l'utente dal contesto di autenticazione
    const { user } = useAuth()
    const [cardIsVisible, setCardIsVisible] = useState(false)
    const [userName, setUserName] = useState("")
    const [Email, setEmail] = useState("")
    const [formData, setFormData] = useState({
        name: userName,
        email: Email,
        place: "",
        country: "",
        type: "",
        description: "",
        img: "",
        id: "",
    })
    const [value, setValue] = useState("")
    const options = useMemo(() => countryList().getData(), [])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [cardData, setCardData] = useState([])
    const [selectedImageUrl, setSelectedImageUrl] = useState("")
    const [userFavorites, setUserFavorites] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [modalVisible1, setModalVisible1] = useState(false)
    const [selectedExperience, setSelectedExperience] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [IdCardDelete, setIdCardDelete] = useState(null)
    const [skeletonCount, setSkeletonCount] = useState(3);
    const IMGURL = "https://img.freepik.com/photos-gratuite/objets-roche-nature-encadrent-ia-generative-paysage-aquatique-tranquille_188544-12636.jpg"
    // stato per la connessione offline
    const [isOffline, setIsOffline] = useState(!navigator.onLine)

    //--------------------------------------------------------------------------------------------------------------------------------------------//
    // Funzioni

    // funzione per creare una notifica con antd
    const openNotificationWithIcon = (type, message, description, placement) => {
        notification[type]({
            message,
            description,
            placement,
        });
    };

    // genera un Id univoco utilizzando la libreria uuid
    const generateUniqueId = () => {
        const uniqueId = uuidv4(); // Genera un ID univoco utilizzando la funzione uuidv4
        return uniqueId;
    }

    // gestisce il caricamento delle immagini
    const handleImageUpload = (event) => {
        const file = event.target.files[0]; // Ottieni il file caricato dall'input file

        if (file.size > 1048487) { // Verifica se la dimensione del file è superiore a 1 MB
            openNotificationWithIcon('warning', 'Image size too large', 'Maximum size allowed is 1 MB', 'top'); // Mostra una notifica se il file è troppo grande
            return;
        }

        const reader = new FileReader(); // Crea un oggetto FileReader

        reader.onloadend = () => {
            const imgUrl = reader.result; // Ottieni l'URL dell'immagine caricata
            setSelectedImageUrl(imgUrl); // Imposta l'URL dell'immagine nell stato
        };

        if (file) {
            reader.readAsDataURL(file); // Leggi il file come URL dati
        }
    }

    // gestisce il cambiamento dei valori degli input
    const handleInputChange = (e) => {
        const { name, value } = e.target; // Ottieni il nome e il valore dell'input
        setFormData({ ...formData, [name]: value }); // Aggiorna lo stato dei dati del modulo con il nuovo valore
    }

    // gestisce il cambiamento del paese nel campo di selezione
    const changeHandler = (selectedOption) => {
        setValue(selectedOption.label); // Imposta il valore selezionato nel campo di selezione del paese
        setFormData({
            ...formData,
            country: selectedOption.label
        });
    }

    const showCard = () => {
        setCardIsVisible(true);
    }

    const closeCard = () => {
        setCardIsVisible(false);
        setFormData({
            name: userName,
            email: Email,
            place: "",
            country: "",
            type: "",
            description: "",
            img: "",
            id: "",
        }); // Reimposta lo stato dei dati del modulo
    }


    const openModal = () => {
        setIsModalOpen(true); // Apre il modal impostando lo stato su true
    }

    const closeModal = () => {
        setIsModalOpen(false); // Chiude il modal impostando lo stato su false
    }

    // Invio dati e caricamento firestore delle esperienze
    const handleSubmit = async (e) => {
        e.preventDefault(); // Impedisce il comportamento predefinito del modulo

        // Verifica se tutti i campi sono compilati
        if (formData.place.trim() === "" || formData.country.trim() === "" || formData.type.trim() === "" || formData.description.trim() === "") {
            openNotificationWithIcon('warning', 'All fields are required', '', 'top'); // Mostra una notifica se i campi sono vuoti
            return;
        }

        // Prepara i dati della nuova esperienza
        let imgUrl = selectedImageUrl === "" ? IMGURL : selectedImageUrl; // Se non è stata caricata un'immagine, utilizza un'immagine di default
        const complexId = generateUniqueId(); // Genera un ID univoco per l'esperienza
        const newCardData = {
            name: userName,
            place: formData.place,
            country: formData.country,
            type: formData.type,
            description: formData.description,
            email: Email,
            img: imgUrl,
            id: complexId,
        };

        try {
            // Salva la nuova esperienza nel database
            const reviewsCollectionRef = collection(db, 'card');
            await addDoc(reviewsCollectionRef, newCardData);

            // Aggiorna l'interfaccia utente
            setCardData(prevCardData => [...prevCardData, newCardData]); // Aggiungi la nuova esperienza ai dati esistenti
            setFormData({ name: userName, email: Email, place: "", country: "", type: "", description: "", img: "", id: "" }); // Reimposta lo stato dei dati del modulo
            openNotificationWithIcon('success', 'Experience successfully added', '', 'topRight'); // Mostra una notifica di successo
            closeCard(); // Chiudi il modulo

            // Invia notifiche a tutti gli utenti
            sendNotificationToAllUsers(newCardData); // Chiama la funzione per inviare una notifica di test
        } catch (error) {
            openNotificationWithIcon('error', 'Error', 'Ops, An issue occurred while submitting the experience. Please try again', 'top'); // Mostra una notifica di errore se si verifica un problema durante il salvataggio
        }
    };

    // Questa funzione invia notifiche push a tutti gli utenti.
    const sendNotificationToAllUsers = async (newExperience) => {
        try {
            // Ottiene un riferimento alla collezione 'tokens' nel database Firestore.
            const tokensCollectionRef = collection(db, 'tokens');

            // Recupera tutti i documenti nella collezione 'tokens' come snapshot.
            const tokensSnapshot = await getDocs(tokensCollectionRef);

            // Estrae gli ID dei token da ciascun documento.
            const tokens = tokensSnapshot.docs.map(doc => doc.data().token);

            // Crea un array di promesse per l'invio delle notifiche push a ciascun token.
            const promises = tokens.map(async (token) => {
                try {
                    // Effettua una richiesta HTTP POST al servizio di notifica Firebase Cloud Messaging.
                    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'key=AAAAwi7xEpA:APA91bHI1l99R4wA-HfiyjffJQD9JpgU6tS6AGNvEtSGmEVsPnp5Q7FyeATvYREVjCvpC7-DW9wyo-fgmERYcPbu42_VDfJImVxR0EQyoi6Rn4qe4lTqYuZI_Q0gPXOqnULGS-7pW4T7'
                        },
                        body: JSON.stringify({
                            to: token,
                            notification: {
                                title: 'Nuova Esperienza di Viaggio!',
                                body: `${newExperience.name} ha aggiunto una nuova esperienza: ${newExperience.place}`,
                            }
                        })
                    });

                    // Controlla se la risposta è stata ricevuta con successo (status 200 OK).
                    if (!response.ok) {
                        // Se la risposta non è OK, estrai il testo dell'errore dalla risposta.
                        const errorData = await response.text();
                        console.log(errorData);

                        // Lancia un'eccezione con un messaggio di errore dettagliato.
                        throw new Error(`Errore nell'invio della notifica al token ${token}. Risposta: ${errorData}`);
                    }
                } catch (error) {
                    console.error("Errore nell'invio della notifica a un token:", error);
                }
            });

            // Attendiamo che tutte le promesse di invio delle notifiche siano risolte.
            await Promise.all(promises);

            // Logga un messaggio di successo dopo aver inviato tutte le notifiche.
            console.log("Notifiche inviate a tutti gli utenti.");
        } catch (error) {
            // Gestisce gli errori durante l'intero processo di invio delle notifiche.
            console.error("Errore durante il recupero dei token:", error);
        }
    };


    const handleDelete = (id) => {
        setModalVisible1(true)
        setIdCardDelete(id)
    }

    // funzione conferma rimozione esperienza
    const handleDeleteConfirm = async () => {
        try {
            // Ottieni uno snapshot dei documenti con l'ID corrispondente
            const querySnapshot = await getDocs(query(collection(db, 'card'), where('id', '==', IdCardDelete)));

            // Itera su ciascun documento nello snapshot
            querySnapshot.forEach(async (doc) => {
                const cardRef = doc.ref;

                // Elimina il documento dal database
                await deleteDoc(cardRef);

                // Aggiorna lo stato per rimuovere l'esperienza eliminata dalla visualizzazione
                setCardData(prevCardData => prevCardData.filter(card => card.id !== IdCardDelete));
            });

            // Mostra una notifica di successo dopo l'eliminazione
            openNotificationWithIcon(
                'success',
                'Removal Completed',
                `You have eliminated your experience`,
                'topRight'
            );

            // Chiudi il modal di conferma di eliminazione
            setModalVisible1(false);
        } catch (error) {
            // Mostra una notifica di errore in caso di problemi nell'eliminazione
            openNotificationWithIcon(
                'error',
                'Error Delete',
                `There were some issues to eliminate your experience. Try again!`,
                'top'
            );
        }
    };

    const handleCancelRemove = () => {
        setModalVisible(false);
    };

    const handleCancelRemove1 = () => {
        setModalVisible1(false);
    };

    // funzione per confermare la rimozione dai preferiti di una card
    const handleConfirmRemove = async (experience) => {
        try {
            // Verifica se esiste un utente con l'email corrente
            const usersRef = collection(db, 'users');
            const querySnapshot = await getDocs(query(usersRef, where('email', '==', user.email)));
            let userId = "";

            // Se ci sono risultati nella query, ottieni l'ID dell'utente
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    userId = doc.id;
                });
            } else {
                openNotificationWithIcon('error', 'Error', 'You haven\'t a favorites experiences', 'top');
                return;
            }

            if (userId) {
                const userRef = doc(db, "users", userId);
                const preferitiRef = collection(userRef, 'preferiti');
                const preferitiSnapshot = await getDocs(preferitiRef);
                let isExperienceInFavorites = false;
                let docIdToRemove = null;

                // Verifica se l'esperienza selezionata è tra i preferiti dell'utente
                preferitiSnapshot.forEach((doc) => {
                    if (doc.data().id === selectedExperience.id) {
                        isExperienceInFavorites = true;
                        docIdToRemove = doc.id;
                    }
                });

                if (isExperienceInFavorites) {
                    // Rimuovi l'esperienza dai preferiti dell'utente
                    await deleteDoc(doc(preferitiRef, docIdToRemove));

                    // Mostra una notifica di successo
                    openNotificationWithIcon(
                        'success',
                        'Removal Completed',
                        ` You have removed ${selectedExperience.place}'s ${selectedExperience.name}  experience from your favorites`,
                        'topRight'
                    );

                    // Aggiorna lo stato per riflettere la rimozione dell'esperienza dai preferiti
                    setUserFavorites((prevFavorites) => {
                        if (isExperienceInFavorites) {
                            return prevFavorites.filter((favoriteId) => favoriteId !== selectedExperience.id);
                        } else {
                            return [...prevFavorites, selectedExperience.id];
                        }
                    });
                } else {
                    openNotificationWithIcon('error', 'Error', 'You haven\'t this experience in your favorites', 'top');
                }
            } else {
                openNotificationWithIcon('error', 'Error', 'Nessun ID utente trovato per quell\'email', 'top');
                return;
            }

            // Chiudi il modal di conferma
            setModalVisible(false);
        } catch (error) {
            openNotificationWithIcon('error', 'Error', 'Error removing from favorites', 'top');
        }
    };

    // funzione per aggiungere una esperienza nei preferiti
    const addToFavorites = async (experience) => {
        try {
            // Cerca l'utente con l'email corrente nel database
            const usersRef = collection(db, 'users');
            const querySnapshot = await getDocs(query(usersRef, where('email', '==', user.email)));

            let userId = ""

            // Se ci sono risultati nella query, ottieni l'ID dell'utente
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    userId = doc.id;
                });
            } else {
                openNotificationWithIcon('error', 'Error', 'Nessun documento trovato per l\'email specificata', 'top');
                return
            }

            if (userId) {
                // Ottieni il riferimento all'utente e ai suoi preferiti
                const userRef = doc(db, 'users', userId);
                const preferitiRef = collection(userRef, 'preferiti')

                try {
                    // Aggiungi l'esperienza ai preferiti dell'utente
                    await addDoc(preferitiRef, { id: experience.id });

                    // Aggiorna lo stato per riflettere l'aggiunta dell'esperienza ai preferiti
                    setUserFavorites((prevFavorites) => [...prevFavorites, experience.id]);

                    // Mostra una notifica di successo
                    openNotificationWithIcon(
                        'success',
                        'Addition completed',
                        `You added ${experience.place}'s ${experience.name} experience to your favorites`,
                        'topRight'
                    );
                } catch (error) {
                    openNotificationWithIcon('error', 'Error', 'Error adding to favorites', 'top');
                }
            } else {
                openNotificationWithIcon('error', 'Error', 'Nessun ID utente trovato per quell\'email', 'top');
                return
            }

        } catch (error) {
            openNotificationWithIcon('error', 'Error', 'Error during user\'s autenthication', 'top');
        }

    };

    // Gestisce l'aggiunta o la rimozione di un'esperienza dai preferiti dell'utent
    const handleFavoriteToggle = (experience) => {
        setSelectedExperience(experience);

        // Se l'esperienza è già nei preferiti, mostra una modale di conferma
        if (experience && userFavorites.includes(experience.id)) {
            setModalVisible(true);
        }
        // Altrimenti, aggiunge direttamente l'esperienza ai preferiti
        else {
            addToFavorites(experience);
        }
    }

    // Aggiorna il numero di "scheletri" da visualizzare in base alla larghezza della finestra del browser
    const updateSkeletonCount = () => {
        const width = window.innerWidth;
        if (width < 600) {
            setSkeletonCount(1)
        } else if (width < 900) {
            setSkeletonCount(2)
        } else {
            setSkeletonCount(3)
        }
    }

    // Componente React che rappresenta l'anteprima di un'esperienza durante il caricamento
    const ExperienceCardSkeleton = () => (
        <div className='placeDetails'>
            <div className="imageContainer">
                <Skeleton.Image style={{ width: '100%', height: 120, borderRadius: '12px' }} />
            </div>

            <div className='singleCard'>
                <div className='card'>
                    <Skeleton.Input style={{ width: '80%', marginBottom: 8 }} active={true} size="small" />
                    <Skeleton.Input style={{ width: '50%', marginBottom: 8 }} active={true} size="small" />
                    <Skeleton paragraph={{ rows: 1, width: '100%' }} />

                    <div className='rating'>
                        <Skeleton.Input style={{ width: '30%', marginBottom: 8 }} active={true} size="small" />
                        <Skeleton.Input style={{ width: '20%', marginBottom: 8 }} active={true} size="small" />
                    </div>

                    <Skeleton.Input style={{ width: '60%', marginBottom: 8 }} active={true} size="small" />
                    <Skeleton.Input style={{ width: '40%', marginBottom: 8 }} active={true} size="small" />

                    <div className="dietary">
                        <Skeleton paragraph={{ rows: 1, width: '80%' }} />
                    </div>

                    <div className="location">
                        <Skeleton.Avatar shape="circle" size="small" />
                        <Skeleton.Input style={{ width: '80%', marginBottom: 8 }} active={true} size="small" />
                    </div>
                </div>
            </div>
        </div>
    );

    //USE EFFECT
    //--------------------------------------------------------------------------------------------------------------------------------------------//

    // useEffect per monitorare la dimensione della finestra e aggiornare il conteggio degli scheletri.
    // Si attiva una volta all'inizio per inizializzare il conteggio e aggiunge un listener per il ridimensionamento della finestra.
    // Rimuove il listener quando il componente viene smontato.
    useEffect(() => {
        // Inizializza il conteggio degli scheletri in base alla dimensione iniziale della finestra
        updateSkeletonCount();

        // Aggiunge un listener per ricalcolare il conteggio degli scheletri quando la finestra viene ridimensionata
        window.addEventListener('resize', updateSkeletonCount);

        // Rimuove il listener quando il componente viene smontato per evitare perdite di memoria
        return () => window.removeEventListener('resize', updateSkeletonCount);
    }, []);

    // useEffect per recuperare i dati delle card dal database Firestore.
    // Si attiva una volta all'inizio per il caricamento iniziale dei dati delle card.
    useEffect(() => {
        // Imposta isLoading su true per indicare che il caricamento dei dati delle card è in corso
        setIsLoading(true);

        // Recupera i dati delle card dalla collezione 'card' nel database Firestore
        const fetchCardData = async () => {
            try {
                const cardsCollectionRef = collection(db, 'card');
                const querySnapshot = await getDocs(cardsCollectionRef);
                const cardsData = [];

                // Itera sui documenti e li inserisce nell'array cardsData
                querySnapshot.forEach((doc) => {
                    cardsData.push(doc.data());
                });

                // Aggiorna lo stato cardData con i dati recuperati
                setCardData(cardsData);
            } catch (error) {
                console.error('Error fetching card data:', error);
            } finally {
                // Una volta completato il caricamento, imposta isLoading su false
                setIsLoading(false);
            }
        };

        // Chiama la funzione per recuperare i dati delle card
        fetchCardData();
    }, []);

    // Questo useEffect si attiva solo una volta, all'inizio. 
    // Si occupa di impostare il conteggio dei riquadri a scheletro in base alla larghezza della finestra e di aggiornarlo quando la finestra viene ridimensionata.
    useEffect(() => {
        // Inizialmente imposta il conteggio in base alla larghezza corrente della finestra.
        updateSkeletonCount();

        // Aggiunge un listener per il ridimensionamento della finestra e chiama 'updateSkeletonCount' quando la finestra viene ridimensionata.
        window.addEventListener('resize', updateSkeletonCount);

        // Ritorna una funzione di cleanup che rimuove il listener quando il componente viene smontato.
        return () => window.removeEventListener('resize', updateSkeletonCount);
    }, []);

    // Questo useEffect si attiva solo una volta, all'inizio. 
    // Si occupa di recuperare i dati delle card dal database Firebase e li memorizza nello stato del componente.
    useEffect(() => {
        const fetchCardData = async () => {
            setIsLoading(true);
            try {
                // Ottiene un riferimento alla collezione delle card nel database.
                const cardsCollectionRef = collection(db, 'card');
                // Esegue una query per ottenere tutti i documenti nella collezione.
                const querySnapshot = await getDocs(cardsCollectionRef);
                const cardsData = [];
                // Estrae i dati dai documenti e li memorizza in 'cardsData'.
                querySnapshot.forEach((doc) => {
                    cardsData.push(doc.data());
                });
                // Imposta 'cardData' nello stato del componente.
                setCardData(cardsData);
            } catch (error) {
                console.error('Error fetching card data:', error);
            }
            setIsLoading(false);
        };

        // Chiama la funzione 'fetchCardData' all'avvio del componente.
        fetchCardData();
    }, []);

    // Questo useEffect si attiva quando l'utente cambia (accesso o logout) e recupera le esperienze preferite dell'utente dal database Firebase.
    useEffect(() => {
        const fetchUserFavorites = async () => {
            if (user) {
                try {
                    // Ottiene il riferimento alla collezione degli utenti e cerca quelli con l'email dell'utente attualmente connesso.
                    const usersCollectionRef = collection(db, 'users');
                    const querySnapshot = await getDocs(query(usersCollectionRef, where('email', '==', user.email)));

                    if (!querySnapshot.empty) {
                        // Se trova utenti corrispondenti, per ciascuno di essi recupera la lista delle esperienze preferite.
                        querySnapshot.forEach(async (doc) => {
                            const userRef = doc.ref;
                            const preferitiRef = collection(userRef, 'preferiti');
                            const preferitiSnapshot = await getDocs(preferitiRef);

                            const favorites = [];
                            // Per ciascuna esperienza preferita, aggiunge il suo ID alla lista "favorites".
                            preferitiSnapshot.forEach((doc) => {
                                favorites.push(doc.data().id);
                            });

                            // Imposta lo stato "userFavorites" con la lista delle esperienze preferite dell'utente.
                            setUserFavorites(favorites);
                        });
                    }
                } catch (error) {
                    console.error('Error fetching user favorites:', error);
                }
            }
        };

        fetchUserFavorites();
    }, [user]);

    // Questo useEffect si attiva quando l'utente cambia (accesso o logout) e recupera i dati dell'utente dal database Firebase.
    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                try {
                    // Ottiene il riferimento alla collezione degli utenti e cerca quelli con l'email dell'utente attualmente connesso.
                    const usersCollectionRef = collection(db, 'users');
                    const q = query(usersCollectionRef, where('email', '==', user.email));
                    const querySnapshot = await getDocs(q);

                    querySnapshot.forEach((doc) => {
                        // Estrae i dati dell'utente dal documento e li imposta nello stato del componente.
                        const userData = doc.data();
                        setUserName(userData.name);
                        setEmail(userData.email);
                    });
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, [user]);

    //--------------------------------------------------------------------------------------------------------------------------------------------//
    //CACHE

    // Questa funzione asincrona recupera i dati delle card dal database Firestore,
    // li memorizza nello stato cardData e nella cache del browser.
    const fetchAndCacheCardData = async () => {
        try {
            // Riferimento alla collezione 'card' nel database Firestore
            const cardsCollectionRef = collection(db, 'card');

            // Ottiene uno snapshot dei documenti nella collezione
            const querySnapshot = await getDocs(cardsCollectionRef);

            // Array per memorizzare i dati delle card
            const cardsData = [];

            // Itera sui documenti e li inserisce nell'array cardsData
            querySnapshot.forEach((doc) => {
                cardsData.push(doc.data());
            });

            // Aggiorna lo stato cardData con i dati recuperati
            setCardData(cardsData);

            // Memorizza i dati recuperati nella cache del browser
            if ('caches' in window) {
                const cache = await caches.open('cache');
                cache.put('/card', new Response(JSON.stringify(cardsData)));
            }
        } catch (error) {
            console.error("Errore nel caricamento delle card: ", error);
        }
    }

    // Gestisce il cambiamento di stato della connessione (online/offline)
    const handleConnectionChange = () => {
        // Verifica se il dispositivo è online o offline
        const condition = navigator.onLine ? 'online' : 'offline';

        // Aggiorna lo stato isOffline in base alla connessione
        setIsOffline(condition === 'offline');

        // Se la connessione è offline, carica i dati delle card dalla cache
        if (condition === 'offline') {
            loadCardDataFromCache();
        } else {
            // Altrimenti, recupera i dati delle card e li memorizza nella cache
            fetchAndCacheCardData();
        }
    }

    // Funzione per caricare i dati delle card dalla cache del browser
    const loadCardDataFromCache = async () => {
        const cache = await caches.open('cache');
        const cachedResponse = await cache.match('/card');
        if (cachedResponse) {
            const cardData = await cachedResponse.json();
            // Aggiorna lo stato cardData con i dati dalla cache
            setCardData(cardData);
        }
    }

    // useEffect per gestire il caricamento iniziale dei dati delle card e la cache
    useEffect(() => {
        // Aggiunge event listeners per gestire il cambiamento di stato della connessione
        window.addEventListener("online", handleConnectionChange);
        window.addEventListener("offline", handleConnectionChange);

        // In base allo stato della connessione iniziale, recupera i dati delle card o li carica dalla cache
        if (navigator.onLine) {
            fetchAndCacheCardData();
        } else {
            loadCardDataFromCache();
        }

        // Rimuove gli event listeners quando il componente viene smontato
        return () => {
            window.removeEventListener("online", handleConnectionChange);
            window.removeEventListener("offline", handleConnectionChange);
        };
    }, []);

    return (
        <div>
            {isOffline && !cardData.length && (
                <div className="no-internet-overlay">
                    <h1>Connect To The Internet</h1>
                </div>
            )}
            <section className="main container grid">
                <br />
                <Button onClick={showCard} disabled={isOffline}>
                    Insert an Experience
                </Button>
                {cardIsVisible && (
                    <div className="addCardContainer">
                        <div className="heading">
                            <h4>Hi, {userName}</h4>
                            <h2>Add an your travel.</h2>
                            <div className="underline"></div>
                        </div>

                        <form>
                            <div className="form-group">
                                <label htmlFor="place" className="labelStyle">Place</label>
                                <input
                                    type="text"
                                    id="place"
                                    name="place"
                                    value={formData.place}
                                    onChange={handleInputChange}
                                    required
                                    className="inputStyle"

                                />
                            </div>
                            <div className="form-group2">
                                <div className="form-group">
                                    <label htmlFor="type" className="labelStyle">Country</label>
                                    <Select options={options} value={value} onChange={changeHandler} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="type" className="labelStyle">Type of stay   <AiOutlineInfoCircle onClick={openModal} className="info" /></label>
                                    <Select
                                        options={[
                                            { value: 'Relaxing Gateway', label: 'Relaxing Gateway' },
                                            { value: 'Cultural Experience', label: 'Cultural Experience' },
                                            { value: 'Adventure Trip', label: 'Adventure Trip' },
                                            { value: 'Gastronomic Journey', label: 'Gastronomic Journey' },
                                            { value: 'Ecotourism', label: 'Ecotourism' },
                                            { value: 'Romantic Escape', label: 'Romantic Escape' },
                                            { value: 'Active and Sports Vacation', label: 'Active and Sports Vacation' },
                                            { value: 'Educational Travel', label: 'Educational Travel' },
                                        ]}
                                        placeholder="Select a type of trip/experience"
                                        name="type"
                                        onChange={(selectedOption) => setFormData({ ...formData, type: selectedOption.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <div> <BsUpload /> Image of Place (optional (Max size: 1 MB)) </div>

                                <input className="inputStyle" type="file" accept="image/*" onChange={(event) => { handleImageUpload(event) }} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description" className="labelStyle">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    className="inputStyle"
                                />
                            </div>
                            <div className="buttons-container">
                                <button className="buttons" onClick={handleSubmit}>Submit</button>
                                <button className="buttons" onClick={closeCard}>Close</button>
                            </div>



                        </form>
                        <Modal
                            id="modal"
                            isOpen={isModalOpen}
                            onRequestClose={closeModal}
                            style={{
                                overlay: {
                                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                                    zIndex: 1000,
                                },
                                content: {
                                    width: '40%',
                                    height: '50%',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    position: 'fixed',
                                    zIndex: 1001,
                                    borderRadius: '3px',
                                    border: '1px solid white',
                                    padding: '0px',
                                    background: 'rgba(255,255,255,0.95)',
                                    textAlign: 'center'
                                },
                            }}
                        >
                            <strong>Relaxing Getaway:</strong><br />
                            - Spa resorts. <br />
                            - Beachfront retreats.<br />
                            - Wellness retreats.<br />
                            - Yoga and meditation getaways.<br />
                            <br />
                            <strong>Cultural Experience:</strong><br />
                            - Art cities and museums.<br />
                            - Historical and archaeological tours.<br />
                            - Theater and musical performances.<br />
                            - Festivals and cultural events.<br />
                            <br />
                            <strong>Adventure Trip:</strong><br />
                            - Mountain trekking and hiking.<br />
                            - Water sports like surfing and diving.<br />
                            - Safaris and wildlife observation.<br />
                            - Biking and climbing excursions.<br />
                            <br />
                            <strong>Gastronomic Journey:</strong><br />
                            - Food and wine tours.<br />
                            - Local cooking classes.<br />
                            - Exploring local markets.<br />
                            - Gourmet restaurants and traditional cuisine.<br />
                            <br />
                            <strong>Ecotourism:</strong><br />
                            - Eco-lodges and green accommodations.<br />
                            - Nature conservation activities.<br />
                            - Nature hikes and birdwatching.<br />
                            - Organic farms and agriculture.<br />
                            <br />
                            <strong>Romantic Escape:</strong><br />
                            - Luxury resorts and boutique hotels.<br />
                            - Candlelight dinners.<br />
                            - Sunset excursions and cruises.<br />
                            - Secluded and tranquil getaways.<br />
                            <br />
                            <strong>Active and Sports Vacation</strong>:<br />
                            - Camping and hiking trips.<br />
                            - Extreme sports like skydiving and rock climbing.<br />
                            - Sports training and camps.<br />
                            - Participation in local sports events.<br />
                            <br />
                            <strong>Educational Travel:</strong><br />
                            - Foreign language courses.<br />
                            - Study abroad programs and cultural exchanges.<br />
                            - Volunteer work and humanitarian projects.<br />
                            - Educational visits to historical and scientific sites.<br />
                        </Modal>
                    </div>

                )}


                {isLoading ? (
                    <>
                        {Array.from({ length: skeletonCount }).map((_, index) => (
                            <ExperienceCardSkeleton key={index} />
                        ))}
                    </>
                ) : (
                    <div className="setContent grid">
                        {cardData.map(({ country, description, email, name, place, type, img, id }) => {
                            const isCurrentUserCard = email === user.email
                            const isFavorite = userFavorites.includes(id);
                            return (
                                <div data-aos="fade-up" className="singleDestination">
                                    {isCurrentUserCard && <Button className="delete" disabled={isOffline}><AiOutlineDelete onClick={() => handleDelete(id)} disabled={isOffline} />
                                    </Button>}

                                    {!isCurrentUserCard ? (
                                        <div className="prefers">
                                            <span onClick={() => handleFavoriteToggle({
                                                country: country,
                                                description: description,
                                                email: email,
                                                name: name,
                                                place: place,
                                                type: type,
                                                img: img,
                                                id: id,
                                            })}
                                                disabled={isOffline}>
                                                {isFavorite ? <BsFillSuitHeartFill className="heart1" /> : <BsFillSuitHeartFill className="heart2" />}
                                            </span>
                                        </div>
                                    ) : null}




                                    <div className="imageDiv">
                                        <img src={img} alt={place} />
                                    </div>

                                    <div className="cardInfo">
                                        <h4 className="destTitle">
                                            {place}
                                        </h4>
                                        <span className="continent flex">
                                            <HiOutlineLocationMarker className="icon" />
                                            <span className="name">{country}</span>
                                        </span>

                                        <div className="fees flex">
                                            <div className="grade">
                                                <span>{type}</span>
                                            </div>
                                        </div>

                                        <div className="desc">
                                            <p>{description}</p>
                                        </div>
                                        <br></br>
                                        <div className="nameInfo">
                                            <p>By {name}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}


                <AntModal
                    title="Confirm Removal"
                    visible={modalVisible}
                    onCancel={handleCancelRemove}
                    footer={[
                        <Button key="cancel" onClick={handleCancelRemove}>
                            Cancel
                        </Button>,
                        <Button key="confirm" type="primary" onClick={handleConfirmRemove}>
                            Confirm
                        </Button>,
                    ]}
                >
                    Are you sure you want to remove the experience at {selectedExperience?.place} of{' '}
                    {selectedExperience?.name} from your favorites?
                </AntModal>
                <AntModal
                    title="Confirm Deletion"
                    visible={modalVisible1}
                    onCancel={handleCancelRemove1}
                    footer={[
                        <Button key="cancel" onClick={handleCancelRemove1}>
                            Cancel
                        </Button>,
                        <Button key="confirm" type="primary" onClick={handleDeleteConfirm}>
                            Confirm
                        </Button>,
                    ]}
                >
                    Are you sure you want to delete your recorded experience?
                </AntModal>

            </section>

        </div>


    )
}

export default Main