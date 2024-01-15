import React, { useEffect, useState } from 'react';
import './mainpreferiti.css';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { useAuth } from '../../AuthContext';
import { db } from '../../firebase';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc, increment, getDoc } from "firebase/firestore"
import Modal from 'react-modal';
import { BsFillSuitHeartFill } from 'react-icons/bs';
import { notification, Modal as AntModal, Button, Skeleton } from 'antd';
import { Link } from 'react-router-dom'
import { AiOutlinePlus } from 'react-icons/ai'
import imgDefault from "./default.png"

// Imposta l'elemento radice dell'applicazione per il componente Modal
Modal.setAppElement('#root');

const MainPrefiriti = () => {
  // Estrai l'utente dal contesto di autenticazione
  const { user } = useAuth();
  const [cardData, setCardData] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [skeletonCount, setSkeletonCount] = useState(3)
  // stato per la connessione offline
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  // Filtra le carte presenti in 'cardData' in modo da includere solo quelle il cui ID è presente in 'userFavorites'
  const favoriteCards = cardData.filter((card) => userFavorites.includes(card.id));

  //--------------------------------------------------------------------------------------------------------------------------------------------//

  //Funzione per creare una notifica con antd
  const openNotificationWithIcon = (type, message, description, placement) => {
    notification[type]({
      message,
      description,
      placement,
    });
  };

  // Gestisce il clic su un'esperienza per mostrare un modal se l'esperienza è già tra i preferiti dell'utente.
  const handleFavoriteToggle = (experience) => {
    setSelectedExperience(experience);

    // Se l'esperienza è già tra i preferiti dell'utente, imposta il modal come visibile.
    if (experience && userFavorites.includes(experience.id)) {
      setModalVisible(true);
    }
  }

  // funzione che gestisce la conferma di rimozione di un'esperienza dai preferiti dell'utente
  const handleConfirmRemove = async (experience) => {
    try {
      if (selectedExperience) {
        // Ottieni il riferimento agli utenti nel database.
        const usersRef = collection(db, 'users');

        // Cerca un utente con l'email corrente.
        const querySnapshot = await getDocs(query(usersRef, where('email', '==', user.email)));
        let userId = ""

        // Se trovi un utente con l'email corrente, ottieni il suo ID.
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            userId = doc.id;
          });
        } else {
          openNotificationWithIcon('error', 'Error', 'You haven\'t a favorites experiences', 'top');
          return;
        }

        if (userId) {
          // Ottieni il riferimento all'utente nel database.
          const userRef = doc(db, "users", userId)

          // Ottieni il riferimento alla collezione dei preferiti di quell'utente.
          const preferitiRef = collection(userRef, 'preferiti')
          const preferitiSnapshot = await getDocs(preferitiRef)
          let isExperienceInFavorites = false;
          let docIdToRemove = null;

          // Verifica se l'esperienza è tra i preferiti dell'utente.
          preferitiSnapshot.forEach((doc) => {
            if (doc.data().id === selectedExperience.id) {
              isExperienceInFavorites = true
              docIdToRemove = doc.id
            }
          })

          // Se l'esperienza è tra i preferiti, rimuovila dai preferiti.
          if (isExperienceInFavorites) {
            await deleteDoc(doc(preferitiRef, docIdToRemove));

            // Mostra una notifica di rimozione completata.
            openNotificationWithIcon(
              'success',
              'Removal Completed',
              ` You have removed ${selectedExperience.place}'s ${selectedExperience.name}  experience from your favorites`,
              'topRight'
            )

            // Aggiorna lo stato degli ID preferiti dell'utente.
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

        // Chiudi il modal.
        setModalVisible(false);
      } else {
        setSelectedExperience(experience)
      }
    } catch (error) {
      openNotificationWithIcon('error', 'Error', 'Error removing from favorites', 'top');
    }
  };

  const handleCancelRemove = () => {
    setModalVisible(false);
  };

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

  /* Componente per rappresentare una "card vuota" nei preferiti dell'utente quando non ci sono esperienze salvate.
 Mostra un'icona per aggiungere un'esperienza ai preferiti. */
  const EmptyFavoriteCard = () => {
    return (
      <div data-aos="fade-up" className="singleDestination">
        <div className="imageDiv">
          {/* Mostra un'immagine predefinita (es. un'icona di default) */}
          <img src={imgDefault} alt="Default" />
        </div>

        <div className="cardInfo">
          {/* Mostra un link per aggiungere un'esperienza ai preferiti */}
          <Link to="/Experience" className="addExperienceIcon">
            <AiOutlinePlus size={30} />
          </Link>
        </div>
      </div>
    );
  };

  //--------------------------------------------------------------------------------------------------------------------------------------------//

  /*
   Effetto collaterale che recupera i preferiti dell'utente dalla base di dati quando l'utente è autenticato.
   Aggiorna lo stato degli userFavorites con l'elenco dei preferiti dell'utente.
  */
  useEffect(() => {
    const fetchUserFavorites = async () => {
      if (user) {
        try {
          // Ottiene un riferimento alla collezione degli utenti
          const usersCollectionRef = collection(db, 'users');

          // Cerca un documento utente con l'email corrispondente
          const querySnapshot = await getDocs(query(usersCollectionRef, where('email', '==', user.email)));

          if (!querySnapshot.empty) {
            // Se viene trovato un documento utente
            querySnapshot.forEach(async (doc) => {
              const userRef = doc.ref;
              const preferitiRef = collection(userRef, 'preferiti');
              const preferitiSnapshot = await getDocs(preferitiRef);

              const favorites = [];
              preferitiSnapshot.forEach((doc) => {
                // Aggiunge l'ID dell'esperienza ai preferiti all'array favorites
                favorites.push(doc.data().id);
              });

              // Aggiorna lo stato degli userFavorites con l'elenco dei preferiti dell'utente
              setUserFavorites(favorites);
            });
          }
        } catch (error) {
          console.error('Error fetching user favorites:', error);
        }

        // Imposta isLoading a false dopo aver completato il recupero dei preferiti
        setIsLoading(false);
      }
    };

    // Esegue la funzione di recupero dei preferiti dell'utente quando l'utente cambia (o è autenticato)
    fetchUserFavorites();

  }, [user]);

  /*
   Effetto collaterale che recupera i dati delle carte dalla collezione 'card' nella base di dati.
   I dati delle carte vengono memorizzati in cardData.
   Viene eseguito solo una volta all'inizio, poiché la dipendenza è un array vuoto [].
  */
  useEffect(() => {
    const fetchCardData = async () => {
      // Ottiene un riferimento alla collezione 'card'
      const cardsCollectionRef = collection(db, 'card');

      // Esegue una query per ottenere tutti i documenti nella collezione 'card'
      const querySnapshot = await getDocs(cardsCollectionRef);

      const cardsData = [];
      // Itera attraverso i documenti nella querySnapshot e aggiunge i dati delle carte all'array cardsData
      querySnapshot.forEach((doc) => {
        cardsData.push(doc.data());
      });

      // Imposta lo stato cardData con i dati delle carte ottenuti dalla base di dati
      setCardData(cardsData);
    };

    // Esegue la funzione di recupero dei dati delle carte una sola volta all'inizio
    fetchCardData();
  }, []);


  /* 
    Aggiorna il conteggio degli scheletri in base alla larghezza della finestra.
    Aggiunge un ascoltatore di eventi di ridimensionamento della finestra per monitorare le dimensioni della finestra.
  */
  useEffect(() => {
    updateSkeletonCount();
    window.addEventListener('resize', updateSkeletonCount);

    // Rimuove l'ascoltatore di eventi di ridimensionamento della finestra quando il componente viene smontato
    return () => window.removeEventListener('resize', updateSkeletonCount);
  }, []);



  return (
    <div>
      {isOffline && !cardData.length && (
        <div className="no-internet-overlay">
          <h1>Connect To The Internet</h1>
        </div>
      )}
      <section className="main container grid">
        {isLoading ? (
          <>
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <ExperienceCardSkeleton key={index} />
            ))}
          </>
        ) : (
          <div className="setContent grid">
            {favoriteCards.length === 0 ? (
              <>
                <EmptyFavoriteCard />
                <EmptyFavoriteCard />
                <EmptyFavoriteCard />
              </>

            ) : (
              favoriteCards.map((card) => {
                const imageUrl = isOffline && card.cachedImg ? card.cachedImg : card.img;
                const isCurrentUserCard = card.email === user.email;
                const isFavorite = userFavorites.includes(card.id);
                return (
                  <>
                    <div data-aos="fade-up" className="singleDestination" key={card.id}>
                      {!isCurrentUserCard ? (
                        <div className="prefers">
                          <span
                            onClick={() =>
                              handleFavoriteToggle({
                                country: card.country,
                                description: card.description,
                                email: card.email,
                                name: card.name,
                                place: card.place,
                                type: card.type,
                                img: card.img,
                                id: card.id,
                              })

                            }
                            disabled={isOffline}
                          >
                            {isFavorite ? (
                              <BsFillSuitHeartFill className="heart1" />
                            ) : (
                              <BsFillSuitHeartFill className="heart2" />
                            )}
                          </span>
                        </div>
                      ) : null}

                      <div className="imageDiv">
                        <img src={imageUrl} alt={card.place} />
                      </div>

                      <div className="cardInfo">
                        <h4 className="destTitle">{card.place}</h4>
                        <span className="continent flex">
                          <HiOutlineLocationMarker className="icon" />
                          <span className="name">{card.country}</span>
                        </span>

                        <div className="fees flex">
                          <div className="grade">
                            <span>{card.type}</span>
                          </div>
                        </div>

                        <div className="desc">
                          <p>{card.description}</p>
                        </div>
                        <br></br>
                        <div className="nameInfo">
                          <p>By {card.name}</p>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })
            )}

          </div>
        )}

        <AntModal
          title="Removal Confirm"
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
      </section></div>
  );

};

export default MainPrefiriti;
