// Importa le librerie e i componenti necessari.
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Crea un contesto di autenticazione utilizzando createContext().
const AuthContext = createContext();

// Esporta una funzione hook personalizzata chiamata useAuth() che consente ad altri componenti di accedere al contesto di autenticazione.
export const useAuth = () => {
  return useContext(AuthContext);
};

// Definisce il componente AuthProvider che fornisce il contesto di autenticazione ai componenti figli.
export const AuthProvider = ({ children }) => {
  // Stati per gestire l'utente e lo stato di caricamento.
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ottiene l'oggetto di autenticazione.
  const auth = getAuth()

  // Utilizza useEffect() per effettuare l'ascolto dei cambiamenti nell'autenticazione.
  useEffect(() => {
    // onAuthStateChanged() ascolta i cambiamenti di stato dell'utente e viene chiamato quando l'utente effettua l'accesso o esce.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Aggiorna lo stato dell'utente e del caricamento in base allo stato dell'autenticazione.
      setUser(user);
      setLoading(false);
    });

    // Ritorna una funzione di "pulizia" da utilizzare quando il componente viene smontato.
    return () => unsubscribe();
  }, [auth]);

  // Definisce il valore da fornire al contesto di autenticazione.
  const value = {
    user, // L'oggetto "user" rappresenta lo stato dell'utente autenticato.
  };

  // Restituisce il provider del contesto di autenticazione con il valore definito.
  // Il provider renderizza i componenti figli solo quando il caricamento è stato completato (!loading).
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
