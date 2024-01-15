import React, { useState, useEffect } from "react"
import { useAuth } from "../../AuthContext"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import "./review.css"
import { db } from "../../firebase"
import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { Form, Input, Button, notification, Modal as AntModal } from 'antd'


const ReviewUs = () => {
    // Utilizzo del contesto di autenticazione per ottenere l'utente corrente
    const { user } = useAuth()
    const [reviews, setReviews] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const { name, experience, image, review, email } = reviews[currentIndex] || {}
    const [isVisible, setIsVisible] = useState(false)
    const [isVisible2, setIsVisible2] = useState(false)
    const [userName, setUserName] = useState("")
    const [imgUrl, setImgUrl] = useState("")
    const [Email, setEmail] = useState("");
    const [formData, setFormData] = useState({
        name: userName,
        experience: "",
        review: "",
        image: imgUrl,
        email: Email
    })
    const [editing, setEditing] = useState(false)
    const [editFormData, setEditFormData] = useState({
        experience: "",
        review: "",
    })
    const [hasUserReviewed, setHasUserReviewed] = useState(false)
    const [modalVisible1, setModalVisible1] = useState(false);
    const [IdReviewDelete, setIdReviewDelete] = useState(null);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [cacheLoaded, setCacheLoaded] = useState(false);



    // funzione per mostrare le notifiche all'utente
    const openNotificationWithIcon = (type, message, description, placement) => {
        notification[type]({
            message,
            description,
            placement,
        });
    };

    // funzione per gestire l'invio di una nuova recensione
    const handleSubmit = async (values) => {
        // Verifica se l'applicazione è offline.
        if (isOffline) {
            openNotificationWithIcon('error', 'No Internet Connection', 'You cannot submit a review while offline.', 'top');
            return;
        }

        // Verifica se i campi "experience" e "review" sono vuoti.
        if (values.experience.trim() === "" || values.review.trim() === "") {
            openNotificationWithIcon('warning', 'Warning', 'All fields are required', 'top');
            return;
        }

        try {
            // Crea un oggetto "reviewData" con i dati del review da inviare al database.
            const reviewData = {
                name: userName,            // Nome dell'utente.
                experience: values.experience,  // Esperienza inserita dall'utente.
                review: values.review,        // Recensione inserita dall'utente.
                image: imgUrl,              // URL dell'immagine (se presente).
                email: Email,               // Indirizzo email dell'utente.
            };

            // Ottiene il riferimento alla collezione "reviews" nel database Firestore.
            const reviewsCollectionRef = collection(db, 'reviews');

            // Aggiunge il documento con i dati della recensione alla collezione "reviews" e ottiene il riferimento al documento appena creato.
            const docRef = await addDoc(reviewsCollectionRef, reviewData);

            // Aggiunge la recensione alla lista delle recensioni esistenti nell'app.
            setReviews(prevReviews => [...prevReviews, { ...reviewData, id: docRef.id }]);

            // Mostra una notifica di successo.
            openNotificationWithIcon('success', 'Success', 'Review uploaded successfully', 'topRight');

            // Reimposta i campi "experience" e "review" nel modulo del form.
            setFormData({
                ...formData,
                experience: "",
                review: "",
            });

            // Nasconde il modulo di invio recensione.
            setIsVisible(false);

            // Imposta il flag "hasUserReviewed" su "true" per indicare che l'utente ha inviato una recensione.
            setHasUserReviewed(true);
        } catch (error) {
            // Gestisce gli errori, ad esempio problemi di connessione al database.
            console.log(error);

            // Mostra una notifica di errore.
            openNotificationWithIcon('error', 'Error', 'Ops, An issue occurred while submitting the review. Please try again', 'top');
        }
    }

    // funzione per gestire l'invio della recensione modificata dall'utente
    const handleEditSubmit = async (values) => {
        // Verifica se l'applicazione è offline
        if (isOffline) {
            // Mostra un messaggio di errore se l'applicazione è offline e termina la funzione
            openNotificationWithIcon('error', 'No Internet Connection', 'You cannot edit a review while offline.', 'top');
            return;
        }

        try {
            // Ottieni la recensione corrente dalla lista delle recensioni in base all'indice corrente
            const currentReview = reviews[currentIndex];

            // Se la recensione corrente non esiste, lancia un errore
            if (!currentReview) {
                throw new Error("Invalid review data or invalid currentIndex");
            }

            // Ottenere un riferimento alla collezione "reviews" nel database Firestore
            const reviewsCollectionRef = collection(db, 'reviews');

            // Effettua una query per trovare il documento che corrisponde alla recensione corrente
            const querySnapshot = await getDocs(query(reviewsCollectionRef,
                where("name", "==", currentReview.name),
                where("review", "==", currentReview.review),
                where("experience", "==", currentReview.experience),
                where("email", "==", currentReview.email)
            ));

            let reviewDocId;

            // Cicla attraverso il risultato della query per ottenere l'ID del documento corrispondente
            querySnapshot.forEach((doc) => {
                reviewDocId = doc.id;
            });

            // Se non viene trovato un documento, mostra un messaggio di avviso e termina la funzione
            if (!reviewDocId) {
                openNotificationWithIcon('warning', 'Warning', 'Review not found', 'top');
                return;
            }

            // Ottieni un riferimento al documento della recensione da aggiornare
            const reviewDocRef = doc(db, "reviews", reviewDocId);

            // Definisci i dati della recensione aggiornati
            const updatedReviewData = {
                experience: editFormData.experience,
                review: editFormData.review
            };

            // Effettua l'aggiornamento del documento nel database Firestore
            await updateDoc(reviewDocRef, values);

            // Aggiorna la lista delle recensioni localmente con i nuovi dati
            setReviews(prevReviews => prevReviews.map(r =>
                r.email === currentReview.email ? { ...r, ...values } : r
            ));

            // Visualizza una notifica di successo
            openNotificationWithIcon('success', 'Success', 'Review update successfully', 'topRight');

            // Ripristina le variabili e lo stato per completare l'operazione di modifica
            setEditing(false);
            closeUpdateReview();
            setEditFormData({
                experience: "",
                review: "",
            });
        } catch (error) {
            // Gestisci gli errori mostrando un messaggio di errore e registrando l'errore nella console
            console.log(error);
            openNotificationWithIcon('error', 'Error', 'Ops, An issue occurred while submitting the review. Please try again', 'top');
        }
    }

    // Funzione per passare alla recensione successiva
    const nextPerson = () => {
        // Aggiorna currentIndex incrementandolo di 1 e applicando un operatore modulo per garantire che rimanga nell'intervallo delle recensioni disponibili
        setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }

    // Funzione per tornare alla recensione precedente
    const prevPerson = () => {
        // Aggiorna currentIndex decrementandolo di 1 e applicando un operatore modulo per garantire che rimanga nell'intervallo delle recensioni disponibili
        setCurrentIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
    }

    // Funzione per visualizzare una recensione casuale
    const getRandomPerson = () => {
        // Genera un indice casuale tra 0 e la lunghezza dell'array delle recensioni
        const randomIndex = Math.floor(Math.random() * reviews.length);
        // Imposta currentIndex sull'indice casuale generato
        setCurrentIndex(randomIndex);
    }

    // funzione per trovare la recensione dell'utente corrente
    const getCurrentReview = () => {
        // Verifica se l'utente è autenticato
        if (user) {
            // Cerca l'indice della recensione dell'utente nell'array delle recensioni
            const userReviewIndex = reviews.findIndex(review => review.email === user.email);

            // Se l'indice della recensione dell'utente è stato trovato (diverso da -1), imposta currentIndex su quell'indice
            if (userReviewIndex !== -1) {
                setCurrentIndex(userReviewIndex);
            } else {
                // Se l'utente non ha ancora inviato una recensione, mostra un messaggio di errore
                openNotificationWithIcon('error', 'Error', 'You haven´t submitted a review yet', 'top');
            }
        }
    }


    const showReview = () => {
        setIsVisible(true)
        setIsVisible2(false)
    }

    const showEditReview = () => {
        setIsVisible2(true)
        setIsVisible(false)
    }

    const closeReview = () => {
        setIsVisible(false)
        setIsVisible2(false)
    }

    const closeUpdateReview = () => {
        setIsVisible2(false)
        setIsVisible(false)
    }

    // invia modifica recensione
    const handleEditClick = () => {
        // Ottieni la recensione corrente in base all'indice corrente (currentIndex)
        const currentReview = reviews[currentIndex];

        // Imposta i dati di modifica con i valori della recensione corrente
        setEditFormData({
            experience: currentReview.experience,
            review: currentReview.review,
        });

        // Imposta lo stato di "editing" su true, indicando che stai effettuando una modifica
        setEditing(true);

        // Mostra la modalità di modifica della recensione, se applicabile
        showEditReview();
    }

    const handleDelete = (userEmail) => {
        setModalVisible1(true)
        setIdReviewDelete(userEmail)
    }

    // funzione per confermare l'eliminazione di una recensione da parte dell'utente
    const handleDeleteConfirm = async () => {
        try {
            // Verifica se l'utente è autenticato (ha un'email)
            if (user.email) {
                // Ottiene un riferimento alla collezione 'reviews' nel database Firestore
                const reviewsCollectionRef = collection(db, 'reviews');

                // Crea una query per trovare tutte le recensioni dell'utente attuale
                const q = query(reviewsCollectionRef, where('email', '==', user.email));

                // Esegue la query per ottenere un elenco di recensioni dell'utente
                const querySnapshot = await getDocs(q);

                // Variabile per tenere traccia se sono state trovate recensioni dell'utente
                let foundReviews = false;

                // Itera attraverso le recensioni trovate e le elimina dal database
                querySnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref);
                    foundReviews = true;
                });

                // Aggiorna la lista delle recensioni localmente rimuovendo quelle dell'utente
                setReviews(prevReviews => {
                    const updatedReviews = prevReviews.filter(review => review.email !== user.email);

                    // Se tutte le recensioni dell'utente sono state rimosse, reimposta currentIndex a 0
                    if (updatedReviews.length === 0) {
                        setCurrentIndex(0);
                        return updatedReviews;
                    }

                    // Calcola un nuovo indice corrente in modo che rimanga all'interno dei limiti delle recensioni rimaste
                    let newIndex;
                    if (currentIndex >= updatedReviews.length) {
                        newIndex = Math.floor(Math.random() * updatedReviews.length);
                    } else {
                        newIndex = currentIndex;
                    }

                    // Imposta currentIndex sul nuovo indice calcolato
                    setCurrentIndex(newIndex);
                    return updatedReviews;
                });
            }

            // Imposta lo stato "hasUserReviewed" su false per indicare che l'utente ha eliminato la sua recensione
            setHasUserReviewed(false);

            // Mostra una notifica di successo dopo l'eliminazione delle recensioni
            openNotificationWithIcon('success', 'Removal Completed', 'The review has been successfully deleted', 'topRight');
        } catch (error) {
            // Mostra una notifica di errore se si verifica un problema durante l'eliminazione delle recensioni
            openNotificationWithIcon('error', 'Error Deleting', 'There was an issue deleting the review. Please try again', 'top');
        }

        // Chiude il modal, se presente
        setModalVisible1(false);
    }


    //CACHE

    // funzione per ottenere le recensioni dal database Firestore e memorizzarle nella cache 
    const fetchAndCacheReviews = async () => {
        try {
            // Ottieni un riferimento alla collezione 'reviews' nel database Firestore
            const reviewsCollectionRef = collection(db, 'reviews');

            // Esegui una query per ottenere tutte le recensioni nella collezione
            const querySnapshot = await getDocs(reviewsCollectionRef);

            // Crea un array per memorizzare i dati delle recensioni
            const reviewsData = [];

            // Itera attraverso i documenti ottenuti dalla query e aggiungi i loro dati all'array
            querySnapshot.forEach((doc) => {
                reviewsData.push(doc.data());
            });

            // Imposta lo stato 'reviews' con i dati delle recensioni ottenuti
            setReviews(reviewsData);

            // Se il browser supporta il sistema di caching, memorizza le recensioni nella cache
            if ('caches' in window) {
                const cache = await caches.open('cache');
                cache.put('/review', new Response(JSON.stringify(reviewsData)));
            }
        } catch (error) {
            // Gestisce eventuali errori e li registra nella console
            console.error("Errore nel caricamento delle recensioni: ", error);
        }
    }

    // funzione per gestire i cambiamenti nella connessione di rete dell'utente
    const handleConnectionChange = () => {
        // Determina se l'utente è online o offline utilizzando `navigator.onLine`
        const condition = navigator.onLine ? 'online' : 'offline';

        // Imposta lo stato `isOffline` in base alla condizione (true se è offline, altrimenti false)
        setIsOffline(condition === 'offline');

        // Verifica se l'utente è offline e, in tal caso, carica le recensioni dalla cache
        if (condition === 'offline') {
            loadReviewsFromCache();
        } else {
            // Se l'utente è online, richiama la funzione per caricare e memorizzare nella cache le recensioni
            fetchAndCacheReviews();
        }
    }

    // funzione per caricare le recensioni memorizzare nella cache 
    const loadReviewsFromCache = async () => {
        // Apre la cache denominata 'cache'
        const cache = await caches.open('cache');

        // Cerca una risposta memorizzata nella cache con la chiave '/review'
        const cachedResponse = await cache.match('/review');

        // Verifica se è stata trovata una risposta memorizzata nella cache
        if (cachedResponse) {
            // Se è stata trovata una risposta nella cache, estrai i dati delle recensioni dalla risposta come JSON
            const reviews = await cachedResponse.json();

            // Imposta lo stato 'reviews' con i dati delle recensioni dalla cache
            setReviews(reviews);

            // Imposta lo stato 'cacheLoaded' su true per indicare che le recensioni sono state caricate dalla cache
            setCacheLoaded(true);
        } else {
            // Se non è stata trovata una risposta nella cache, imposta lo stato 'cacheLoaded' su false
            setCacheLoaded(false);
        }
    }


    //--------------------------------------------------------------------------------------------------------------------------------------------//

    useEffect(() => {
        // Aggiunge due event listeners per gestire gli eventi di cambio di stato della connessione
        window.addEventListener("online", handleConnectionChange);
        window.addEventListener("offline", handleConnectionChange);

        // Verifica lo stato della connessione iniziale
        if (navigator.onLine) {
            // Se l'utente è online, chiama la funzione per caricare e memorizzare nella cache le recensioni
            fetchAndCacheReviews();
        } else {
            // Se l'utente è offline, chiama la funzione per caricare le recensioni dalla cache
            loadReviewsFromCache();
        }

        // Rimuove gli event listeners quando il componente viene smontato o il valore dell'array delle dipendenze cambia
        return () => {
            window.removeEventListener("online", handleConnectionChange);
            window.removeEventListener("offline", handleConnectionChange);
        };
    }, []);



    // Verifica se l'utente ha inviato una recensione e imposta lo stato 'hasUserReviewed' in base alla presenza di recensioni dell'utente.
    useEffect(() => {
        const checkUserReview = async () => {
            if (user) {
                const reviewsCollectionRef = collection(db, 'reviews')
                const querySnapshot = await getDocs(query(reviewsCollectionRef, where('email', '==', user.email)))
                const hasReview = !querySnapshot.empty
                setHasUserReviewed(hasReview)
            }
        };
        checkUserReview()
    }, [user])


    // Recupera i dati dell'utente dal database e imposta vari stati come il nome, l'URL dell'immagine e l'email.
    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                const usersCollectionRef = collection(db, 'users')
                const q = query(usersCollectionRef, where('email', '==', user.email))
                const querySnapshot = await getDocs(q)

                querySnapshot.forEach((doc) => {
                    const userData = doc.data()
                    setUserName(userData.name)
                    setImgUrl(userData.imgUrl)
                    setEmail(userData.email)
                })
            }
        }
        fetchUserData();
    }, [user])

    // Aggiorna il campo "name" del form con il nome dell'utente.
    useEffect(() => {
        if (userName !== "") {
            setFormData(prevState => ({
                ...prevState,
                name: userName,
            }));
        }
    }, [userName])

    // Recupera tutte le recensioni dal database Firestore e imposta lo stato 'reviews' con i dati delle recensioni.
    useEffect(() => {
        const fetchReviews = async () => {
            const reviewsCollectionRef = collection(db, 'reviews')
            const querySnapshot = await getDocs(reviewsCollectionRef)
            const reviewsData = []
            querySnapshot.forEach((doc) => {
                const review = doc.data()
                reviewsData.push(review)
            })
            setReviews(reviewsData)
        }
        fetchReviews()
    }, [])

    // Inizializza i dati di modifica del form in base alla recensione corrente.
    useEffect(() => {
        if (reviews[currentIndex]) {
            const currentReview = reviews[currentIndex];
            setEditFormData({
                experience: currentReview.experience || "",
                review: currentReview.review || "",
            });
        }
    }, [currentIndex, reviews])





    return (
        <main>
            {isOffline && !cacheLoaded && (
                <div className="no-internet-overlay">
                    <h1>Connect To The Internet</h1>
                </div>
            )}
            {user ? (
                !hasUserReviewed ? (
                    <div className="buttons-container">
                        <Button onClick={showReview} disabled={isOffline}>Leave your review</Button>
                    </div>
                ) : null
            ) : (
                <div className="buttons-container">
                    <p>You need to log in to leave a review.</p>
                    {isVisible && setIsVisible(false)}
                </div>
            )}

            <section className={`container ${isOffline ? 'offline-mode' : ''}`}>
                {isVisible && (
                    <Form
                        className='form-containerSu'
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <h2 className="heading">Leave your review</h2>
                        <Form.Item
                            label="Experience"
                            name="experience"
                            rules={[{ required: true, message: 'Please enter your experience!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Review"
                            name="review"
                            rules={[{ required: true, message: 'Please enter your review!' }]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                        <div className="form-button-group">
                            <Button type="primary" htmlType="submit">
                                Submit Review
                            </Button>
                            <Button onClick={closeReview}>
                                Close
                            </Button>
                        </div>
                    </Form>
                )}

                {isVisible2 && (
                    <Form
                        className="form-containerSu"
                        layout="vertical"
                        onFinish={handleEditSubmit}
                    >
                        <div className="heading">
                            <h4>Hi, {userName}</h4>
                            <h2>Update your review</h2>
                        </div>

                        <Form.Item
                            label="Experience"
                            name="experience"
                            rules={[{ required: true, message: 'Please enter your experience!' }]}
                        >
                            <Input defaultValue={editFormData.experience} />
                        </Form.Item>
                        <Form.Item
                            label="Review"
                            name="review"
                            rules={[{ required: true, message: 'Please enter your review!' }]}
                        >
                            <Input.TextArea defaultValue={editFormData.review} />
                        </Form.Item>
                        <div className="form-button-group">
                            <Button type="primary" htmlType="submit" disabled={isOffline}>
                                Update Review
                            </Button>
                            <Button onClick={closeReview}>
                                Close
                            </Button>
                        </div>
                    </Form>

                )}

                <div className={"form-containerRe"}>
                    <article className="review">
                        <div className="title">
                            <h2>Our Reviews</h2>
                            <div className="underline"></div>
                            {user && user.email && reviews[currentIndex] && reviews[currentIndex].email && user.email.trim() === reviews[currentIndex].email.trim() ? (
                                <div>
                                    <br></br>
                                    <Button onClick={handleEditClick} disabled={isOffline}>
                                        Update your Review
                                    </Button>
                                    <Button onClick={() => handleDelete(user.email)} disabled={isOffline}>Delete Review</Button>
                                </div>

                            ) : (null)}

                        </div>


                        <div className="img-container">
                            <img src={image} alt={name} className="person-img" />
                        </div>
                        <h4 className="author">{name}</h4>
                        <p className="experience">{experience}</p>
                        <p className="info">{review}</p>
                        <div className="button-container">
                            <Button className="prev-btn" onClick={prevPerson}>
                                <FaChevronLeft />
                            </Button>
                            <Button className="next-btn" onClick={nextPerson}>
                                <FaChevronRight />
                            </Button>
                        </div>
                        <Button className="random-btn" onClick={getRandomPerson}>Get Random Review</Button>
                        <br />
                        {user ? (
                            <Button className="random-btn" onClick={getCurrentReview}>My review</Button>
                        ) : (null)}

                    </article>
                </div>

                <AntModal
                    title="Confirm Deletion"
                    visible={modalVisible1}
                    onCancel={() => setModalVisible1(false)}
                    footer={[
                        <Button key="cancel" onClick={() => setModalVisible1(false)}>Cancel</Button>,
                        <Button key="confirm" type="primary" onClick={handleDeleteConfirm}>Confirm</Button>,
                    ]}
                >
                    Are you sure you want to delete this review?
                </AntModal>



            </section>
        </main >
    );
};

export default ReviewUs;
