import React, { useEffect, useState } from 'react'
import { MenuItem } from './MenuItem'
import { Link } from "react-router-dom"
import { MdOutlineTravelExplore } from 'react-icons/md'
import { AiFillCloseCircle } from 'react-icons/ai'
import { PiDotsNineBold } from 'react-icons/pi'
import { db } from '../../firebase'
import { collection, getDocs, addDoc, doc, updateDoc, query, where } from 'firebase/firestore'
import Modal from 'react-modal'
import { RiLockPasswordLine } from 'react-icons/ri'
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import 'firebase/auth';
import './navbar.css'
import "./registerForm.css"
import { loginUser, logoutUser } from '../Login'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem1 from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Logout from '@mui/icons-material/Logout'
import { notification, Collapse, Flex, Button, Input } from 'antd'
import { GrUpdate } from "react-icons/gr"
import { EyeInvisibleOutlined, UserOutlined, UploadOutlined, MailOutlined, EyeTwoTone } from '@ant-design/icons'
// Imposta l'elemento radice dell'applicazione per il componente Modal
Modal.setAppElement('#root')

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const [users, setUsers] = useState([])
  const [isLogin, setIsLogin] = useState(false)
  const [user, setUser] = useState(null)
  const [active, setActive] = useState('navBar')
  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalOpen1, setIsModalOpen1] = useState(false)
  const [action, setAction] = useState("Sign Up")
  const usersCollectionRef = collection(db, "users")
  const [selectedImageUrl, setSelectedImageUrl] = useState("")
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  const [isEditName, setIsEditName] = useState(false)
  const [isEditSurname, setIsEditSurname] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [editedSurname, setEditedSurname] = useState('')
  const [hasFavorite, setHasFavorite] = useState(false)
  const { Panel } = Collapse
  // Estrai l'utente dal contesto di autenticazione
  const auth = getAuth()

  //--------------------------------------------------------------------------------------------------------------------------------------------//

  // Funzione per la creazione di un nuovo utente
  const createUser = async () => {
    // Verifica la connessione internet
    if (!isOnline()) {
      openNotificationWithIcon('error', 'No Internet Connection', 'Please connect to the internet to register.', 'top');
      return;
    }

    // Verifica che tutti i campi siano stati compilati
    if (name === "" || surname === "" || email === "" || password === "") {
      openNotificationWithIcon('warning', 'All fields are mandatory', '', 'top');
      return;
    }

    // Verifica che la password rispetti i requisiti
    if (!password.match(passwordRegex)) {
      openNotificationWithIcon('warning', 'Warning Password', 'The password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and must be at least 8 characters long', 'top');
      return;
    }

    // Verifica che l'email non sia già stata utilizzata da un altro utente
    const userExists = users.some((user) => user.email === email);
    if (userExists) {
      openNotificationWithIcon('Error', 'Email already been used', 'This email address has already been used', 'top');
      return;
    }

    // Imposta un URL predefinito per l'immagine del profilo se non è stata selezionata un'immagine personalizzata
    let imgUrl = selectedImageUrl;
    if (selectedImageUrl === "") {
      imgUrl = "https://www.playbasket.it/images/profiles/tavella_massimiliano[pB-9037]-basketquaderni[2022-2023].jpg";
    } else {
      imgUrl = selectedImageUrl;
    }

    // Aggiunge il nuovo utente alla lista degli utenti
    setUsers([...users, { email, imgUrl, name, surname }]);

    try {
      // Crea un nuovo utente nell'autenticazione e aggiunge i dati al database
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await addDoc(usersCollectionRef, {
        email,
        imgUrl,
        name,
        surname,
      });

      // Chiude il modale di registrazione e mostra una notifica di successo
      closeModal();
      openNotificationWithIcon('success', 'Registration completed successfully!\nHi ' + email, '', 'topRight');
    } catch (error) {
      // In caso di errore, mostra una notifica di errore
      openNotificationWithIcon('error', 'Registration Error', 'Error occurred during registration. Please try again.', 'top');
      return;
    }
  }

  // Funzione per la gestione del login dell'utente
  const handleLogin = async (e) => {
    e.preventDefault();

    // Verifica la connessione internet
    if (!isOnline()) {
      openNotificationWithIcon('error', 'No Internet Connection', 'Please connect to the internet to login.', 'top');
      return;
    }

    // Verifica che email e password siano stati inseriti
    if (!email || !password) {
      if (!email) {
        openNotificationWithIcon('error', 'Email required', '', 'top');
      }
      if (!password) {
        openNotificationWithIcon('error', 'Password required', '', 'top');
      }
      return;
    }

    try {
      // Effettua il login dell'utente
      await loginUser(email, password);

      // Mostra una notifica di login avvenuto con successo e pulisce i campi email e password
      openNotificationWithIcon('success', 'Login successful', 'Hi ' + email, 'topRight');
      setEmail('');
      setPassword('');
      closeModal();
    } catch (error) {
      if (error.code === 'auth/invalid-email') {
        // Notifica se l'email non è stata trovata
        openNotificationWithIcon('error', 'Email not found', 'The email entered does not exist. The Character \'@\' is required', 'top');
      } else if (error.code === 'auth/invalid-login-credentials') {
        // Notifica se le credenziali (email o password) sono errate
        openNotificationWithIcon('error', 'Incorrect Password or Email', 'The password/email entered is incorrect.\nIf you don\'t remember it, you can recover it by clicking below.', 'top');
      } else {
        // Notifica per altri errori
        openNotificationWithIcon('error', 'Incorrect credentials', 'Impossible to Login', 'top');
      }

      // Pulisce i campi email e password
      setEmail('');
      setPassword('');
      closeModal();
    }
  }

  // Funzione per la gestione del logout dell'utente
  const handleLogout = async () => {
    try {
      // Reindirizza l'utente alla homepage
      window.location.href = '/';

      // Effettua il logout dell'utente
      await logoutUser();

      // Mostra una notifica di logout avvenuto con successo
      openNotificationWithIcon('success', 'Logged out successfully', 'Goodbye ', 'topRight');

      // Resetta i campi name, surname, email e password nell'applicazione
      setName('');
      setSurname('');
      setEmail('');
      setPassword('');
    } catch (error) {
      // Mostra una notifica di errore generico in caso di impossibilità a effettuare il logout
      openNotificationWithIcon('error', 'General Error', 'Impossible to Unlogged', 'top');
    }
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setName("")
    setSurname("")
    setEmail("")
    setPassword("")
    setIsModalOpen(false)
  }

  // Funzione per impostare l'elemento di ancoraggio (`anchorEl`) per il menu a comparsa in base all'elemento su cui è stato effettuato il click.
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  // funzione per aprire il modal del profilo utente
  const handleOpenModalProfile = () => {
    setIsModalOpen1(true)
  }

  // funzione per chiudere il modal del profilo utente
  const handleCloseModalProfile = () => {
    setIsModalOpen1(false)
  }

  // funzione per chiudere il modal (Navbar)
  const handleClose = () => {
    setAnchorEl(null)
  }

  // funzione per gestire il caricamento di un'immagine dall'input file
  const handleImageUpload = (event) => {
    // Ottiene il file selezionato dall'input del file.
    const file = event.target.files[0];

    // Crea un oggetto FileReader per leggere il contenuto del file.
    const reader = new FileReader();

    // Definisce l'azione da eseguire quando il file è stato completamente letto.
    reader.onloadend = () => {
      // Ottiene l'URL dell'immagine letta dal file.
      const imgUrl = reader.result;

      // Imposta l'URL dell'immagine come selezionato.
      setSelectedImageUrl(imgUrl);
    };

    // Verifica se un file è stato selezionato.
    if (file) {
      // Legge il contenuto del file come URL data.
      reader.readAsDataURL(file);
    }
  }

  const showNav = () => {
    setActive('navBar activeNavbar')
  }

  const removeNav = () => {
    setActive('navBar')
  }

  // Funzione per creare una notifica in antd
  const openNotificationWithIcon = (type, message, description, placement) => {
    notification[type]({
      message,
      description,
      placement,
    })
  }

  // funzione per visualizzare l'input per modificare il nome nel database
  const updateName = (userId, currentName) => {
    setEditedName(currentName)
    setIsEditName(true)
  }

  // funzione per visualizzare l'input per modificare il cognome nel database
  const updateSurname = (userId, currentSurname) => {
    setEditedSurname(currentSurname)
    setIsEditSurname(true)
  }

  // funzione che mnodifica il nome dell'utente nel database
  const handleUpdateName = async (userId, newName) => {
    try {
      // Ottiene il riferimento al documento dell'utente nel database.
      const userDocRef = doc(db, "users", userId)

      // Aggiorna il nome dell'utente nel documento del database.
      await updateDoc(userDocRef, { name: newName })

      // Aggiorna lo stato dell'app per riflettere il nuovo nome dell'utente.
      setUsers(prevUsers => prevUsers.map(user =>
        user.id === userId ? { ...user, name: newName } : user
      ));

      // Mostra una notifica di successo.
      openNotificationWithIcon('success', 'You have changed your name.', '', 'topRight')

      // Disabilita la modalità di modifica del nome.
      setIsEditName(false)
    } catch (error) {
      console.error('Error updating name:', error)
    }
  }

  // funzione che modifica il cognome dell'utente nel database
  const handleUpdateSurname = async (userId, newSurname) => {
    try {
      // Ottiene il riferimento al documento dell'utente nel database.
      const userDocRef = doc(db, "users", userId)

      // Aggiorna il cognome dell'utente nel documento del database.
      await updateDoc(userDocRef, { surname: newSurname })

      // Aggiorna lo stato dell'app per riflettere il nuovo cognome dell'utente.
      setUsers(prevUsers => prevUsers.map(user =>
        user.id === userId ? { ...user, surname: newSurname } : user
      ));

      // Mostra una notifica di successo.
      openNotificationWithIcon('success', 'You have changed your surname.', '', 'topRight')

      // Disabilita la modalità di modifica del cognome.
      setIsEditSurname(false)
    } catch (error) {
      console.error('Error updating surname:', error)
    }
  }

  // Funzione per il recupero della password
  const resetPassword = async () => {

    // Verifica se l'utente è connesso a Internet.
    if (!isOnline()) {
      alert('No Internet Connection. Please connect to the internet to reset password.');
      return;
    }

    // Chiede all'utente di inserire l'indirizzo email associato al proprio account.
    const email = prompt('Inserisci l\'indirizzo email associato al tuo account:');

    try {
      // Invia l'email di reset della password utilizzando l'indirizzo email fornito.
      await sendPasswordResetEmail(auth, email);
      alert('Email di reset della password inviata con successo. Controlla la tua casella di posta.');
    } catch (error) {
      console.error('Errore durante l\'invio dell\'email di reset della password:', error);
      alert('Si è verificato un errore durante l\'invio dell\'email di reset della password.');
    }
  }

  // dati dell'utente: verifica se c'è un utente e filtra tutti gli utenti per trovare quello corrente (loggato)
  const userPanels = user && users.filter(user1 => user1.email === user.email).map((user1, index) => (
    <React.Fragment key={index}>
      <p style={{ marginTop: '10px', margin: 'auto', fontSize: '16px', color: '#555', whiteSpace: 'pre-wrap', maxWidth: '150px', alignItems: 'center' }}>
        <img src={user1.imgUrl} alt={user1.name} style={{ maxWidth: '80%', height: 'auto', borderRadius: '1rem', marginTop: '10px' }} />
      </p>
      <Panel header={`Name`} key={`${index}_name`}>
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '5px', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)', textAlign: 'left' }}>
          {isEditName ? (
            <div>
              <Input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
              <Button value="small" style={{ width: '100%', fontSize: '10px' }} onClick={() => handleUpdateName(user1.id, editedName)}>Update</Button>
              <Button value="small" style={{ width: '100%', fontSize: '10px' }} onClick={() => setIsEditName(false)}>Cancel</Button>
            </div>
          ) : (
            <p style={{ margin: '0', fontSize: '14px', color: '#555', display: 'flex', alignItems: 'center' }}>
              <span style={{ whiteSpace: 'pre-wrap' }}>{user1.name}</span>
              <span style={{ marginLeft: 'auto', cursor: 'pointer' }}><GrUpdate onClick={() => updateName(user1.id, user1.name)} /></span>
            </p>
          )}
        </div>
      </Panel>
      <Panel header={`Surname`} key={`${index}_surname`}>
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '5px', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)', textAlign: 'left' }}>
          {isEditSurname ? (
            <div>
              <Input
                type="text"
                value={editedSurname}
                onChange={(e) => setEditedSurname(e.target.value)}
              />
              <Button value="small" style={{ width: '100%', fontSize: '10px' }} onClick={() => handleUpdateSurname(user1.id, editedSurname)}>Update</Button>
              <Button value="small" style={{ width: '100%', fontSize: '10px' }} onClick={() => setIsEditSurname(false)}>Cancel</Button>
            </div>
          ) : (
            <p style={{ margin: '0', fontSize: '14px', color: '#555', display: 'flex', alignItems: 'center' }}>
              <span style={{ whiteSpace: 'pre-wrap' }}>{user1.surname}</span>
              <span style={{ marginLeft: 'auto', cursor: 'pointer' }}><GrUpdate onClick={() => updateSurname(user1.id, user1.surname)} /></span>
            </p>
          )}
        </div>
      </Panel>
      <Panel header={`Email`} key={`${index}_email`}>
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '5px', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)', textAlign: 'left' }}>
          <p style={{ margin: '0', fontSize: '14px', color: '#555', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            <span style={{ whiteSpace: 'pre-wrap' }}>{user1.email}</span>
          </p>
        </div>
      </Panel>

    </React.Fragment>
  ))

  // Funzione che verifica se l'applicazione è connessa a Internet.
  const isOnline = () => {
    return navigator.onLine;
  }

  //--------------------------------------------------------------------------------------------------------------------------------------------//

  // Effetto collaterale che gestisce il cambiamento di stato dell'autenticazione.
  useEffect(() => {
    // Sottoscrivi una funzione per gestire il cambiamento di stato dell'autenticazione.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Aggiorna lo stato dell'utente con il nuovo utente.
      setUser(user);
      // Imposta la variabile di stato isLogin su true per indicare che l'utente è loggato.
      setIsLogin(true);
    });

    // Ritorna una funzione di "pulizia" che sarà chiamata quando l'effetto viene "smontato".
    // Qui, annulliamo la sottoscrizione all'evento di stato dell'autenticazione e impostiamo isLogin su false.
    return () => {
      unsubscribe();
      setIsLogin(false);
    };
  }, [auth]);


  // Effetto collaterale che recupera i dati degli utenti dalla collezione nel database.
  useEffect(() => {
    // Funzione asincrona per ottenere i documenti dalla collezione degli utenti.
    const getUsers = async () => {
      // Ottieni i documenti dalla collezione e aspetta che la promessa sia risolta.
      const data = await getDocs(usersCollectionRef);
      // Imposta lo stato degli utenti con i dati dei documenti e assegna loro un identificatore unico (id).
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    // Chiamiamo la funzione per ottenere i dati degli utenti quando il componente viene montato (array delle dipendenze vuoto).
    getUsers();
  }, []);


  //controllo se l'utente ha nei preferiti almeno una esperienza per visualizzazione della routes "Favorites"
  useEffect(() => {
    // Funzione asincrona per verificare se l'utente ha preferiti.
    const checkFavorites = async () => {
      if (user) {
        try {
          // Ottenere il riferimento alla collezione degli utenti.
          const userDocRef = collection(db, 'users');
          // Eseguire una query per trovare il documento dell'utente con l'email corrispondente.
          const querySnapshot = await getDocs(query(userDocRef, where('email', '==', user.email)));

          querySnapshot.forEach(async (doc) => {
            const userRef = doc.ref;
            const preferitiRef = collection(userRef, 'preferiti');
            const preferitiSnapshot = await getDocs(preferitiRef);

            const favorites = [];
            preferitiSnapshot.forEach((doc) => {
              favorites.push(doc.data().id);
            });

            // Se l'utente ha preferiti, imposta lo stato "hasFavorite" su false.
            if (!favorites.length === 0) setHasFavorite(false);
          });
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      }
    };

    // Chiamiamo la funzione per verificare se l'utente ha preferiti quando l'utente cambia (array delle dipendenze contiene "user").
    checkFavorites();
  }, [user]);

  return (
    <section className='navBarSection'>
      <header className='header flex'>
        <div className='logoDiv'>
          <a href="/" className="logo flex">
            <h1><MdOutlineTravelExplore className="icon" />TravelBuddy</h1>
          </a>
        </div>

        <div className={active}>
          <ul className="navLists grid">
            {MenuItem.map((item, index) => {
              if (!user && (item.title === "Experience" || item.title === "Favorites")) {
                return null;
              }

              return (
                <li key={index} className="navItem">
                  <Link to={item.url} className={item.cName}>
                    {item.title}
                  </Link>
                </li>
              );
            })}
            {user ? (
              <div className="">
                <React.Fragment>
                  <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                    <Tooltip title={user.email}>
                      <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                      >
                        <Avatar alt={user.email} src="/static/images/avatar/1.jpg" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem1 onClick={handleOpenModalProfile}>
                      <Avatar src={user.imgUrl} /> My Profile
                    </MenuItem1>
                    <Divider />
                    <MenuItem1 onClick={handleLogout}>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem1>
                  </Menu>
                </React.Fragment>
                <Modal
                  id="modal"
                  isOpen={isModalOpen1}
                  onRequestClose={handleCloseModalProfile}
                  style={{
                    overlay: {
                      backgroundColor: 'rgba(255, 255, 255, 0.4)',
                      zIndex: 1000,
                    },
                    content: {
                      width: '50%',
                      height: '70%',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      position: 'fixed',
                      zIndex: 1001,
                      borderRadius: '1rem',
                      border: 'none',
                      padding: '0px',
                      background: 'transparent'
                    },
                  }}
                >
                  <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', textAlign: 'center', maxWidth: '600px', margin: 'auto' }}>
                    <h2 style={{ fontSize: '24px', marginBottom: '15px', color: '#333' }}>Yours Data</h2>
                    {userPanels.length > 0 ? (
                      <Collapse accordion>{userPanels}</Collapse>
                    ) : (
                      <p>No data available for the current user.</p>
                    )}
                    <Flex
                      vertical
                      gap="small"
                      style={{
                        width: '100%',
                      }}
                    >
                      <Button type="primary" block onClick={handleCloseModalProfile} style={{ marginTop: '10px' }}>
                        Close
                      </Button>
                    </Flex>
                  </div>


                </Modal>
              </div>
            ) : (
              <button className='btn' onClick={openModal}>Login or Sign-up</button>
            )}
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
                  width: '50%',
                  height: '80%',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  position: 'fixed',
                  zIndex: 1001,
                  borderRadius: '1rem',
                  border: 'none',
                  padding: '0px',
                  background: 'transparent'
                },
              }}
            >
              <div className="container1">
                <div className="header1">
                  <div className="text1">{action}</div>
                  <div className="underline1"></div>
                </div>
                <div className="inputs">
                  {action === "Login" ? <div></div> :
                    <div>
                      <Input
                        placeholder="Enter your name"
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        onChange={(event) => { setName(event.target.value) }}
                        required
                        style={{ marginBottom: '5px' }}
                        rules={[{ required: true, message: 'Please enter your name!' }]}
                      />
                      <Input
                        placeholder="Enter your surname"
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        onChange={(event) => { setSurname(event.target.value) }}
                        required
                        style={{ marginBottom: '5px' }}
                        rules={[{ required: true, message: 'Please enter your surname!' }]}
                      />
                      <Input
                        placeholder="Upload your profile image"
                        prefix={<UploadOutlined className="site-form-item-icon" />}
                        onChange={(event) => { handleImageUpload(event) }}
                        style={{ marginBottom: '5px' }}
                        type="file"
                        accept="image/*"
                      />
                    </div>
                  }
                  <Input
                    placeholder="Enter your surname"
                    prefix={<MailOutlined className="site-form-item-icon" />}
                    onChange={(event) => { setEmail(event.target.value) }}
                    required
                    type="email"
                    style={{ marginBottom: '5px', marginTop: '-25px' }}
                    rules={[{ required: true, message: 'Please enter your username!' }]}
                  />

                  <Input.Password
                    prefix={<RiLockPasswordLine className="site-form-item-icon" />}
                    placeholder="input password"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    onChange={(event) => { setPassword(event.target.value) }}
                    required
                    style={{ marginBottom: '5px', marginTop: '-25px' }}
                    rules={[{ required: true, message: 'Please enter your password!' }]}
                  />
                </div>
                {action === "Login" ? <div><div><div className="forgot-password">
                  Lost Password? <span onClick={resetPassword}>Click Here!</span>
                </div></div></div> : <div><br /></div>}

                {action === "Sign Up" ? (
                  <Button type="default" block onClick={(e) => { createUser(e) }} style={{ marginBottom: '10px' }}>
                    Register
                  </Button>
                ) : (
                  <div><br /></div>
                )}

                {action === "Login" ? (
                  <Button type="default" block onClick={(e) => { handleLogin(e) }} style={{ marginBottom: '30px', marginTop: '-30px' }}>
                    Sign In
                  </Button>
                ) : (
                  <div><br /></div>
                )}

                <div className="submit-container">
                  <button className={action === "Login" ? "submit gray" : "submit"} onClick={() => { setAction("Sign Up") }}>
                    Sign Up
                  </button>
                  <button className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => { setAction("Login") }}>
                    Login
                  </button>



                </div>
              </div>

              <div onClick={closeModal} style={{ position: 'absolute', top: '1rem', right: '1.5rem', color: ' hsl(199, 100%, 33%)', cursor: 'pointer' }}><AiFillCloseCircle className='icon' /></div>

            </Modal>
          </ul>


          <div onClick={removeNav} className="closeNavbar"><AiFillCloseCircle className='icon' /></div>
        </div>

        <div onClick={showNav} className="toggleNavbar">
          <PiDotsNineBold className='icon' />
        </div>
      </header>
    </section >

  )

}

export default Navbar