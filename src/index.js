// Importa le librerie necessarie.
import React from "react";
import ReactDOM from "react-dom/client";
import App from './App';
import { BrowserRouter } from "react-router-dom";

// Crea un elemento radice utilizzando ReactDOM.createRoot() e specifica l'elemento DOM di destinazione con getElementById('root').
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderizza l'app React all'interno del router BrowserRouter all'interno dell'elemento radice.
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
