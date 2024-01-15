import React from 'react'
import './App.css'
import Home2 from './routes/Home2'
import About from './routes/About'
import Contact from './routes/Contact'
import Packages from './routes/Packages'
import Review from './routes/Review'
import Experience from './routes/Experience'
import { Route, Routes } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import Favorites from './routes/Favorites'
import { AuthProvider } from './AuthContext'
import NotificationManager from './Components/NotificationManager/NotificationManager'

// Definisce il componente principale "App".
function App() {
    return (
        // Utilizza l'AuthProvider per fornire contesto di autenticazione.
        <AuthProvider>
            <>
                {/* Renderizza il componente "NotificationManager" per gestire le notifiche. */}
                <NotificationManager />

                {/* Renderizza il componente "Navbar" per la navigazione. */}
                <Navbar />

                {/* Utilizza "Routes" per gestire le rotte dell'applicazione. */}
                <Routes>
                    {/* Rotta per la homepage "Home2". */}
                    <Route path="/" element={<Home2 />} />

                    {/* Rotta per la pagina "About". */}
                    <Route path="/About" element={<About />} />

                    {/* Rotta per la pagina "Contact". */}
                    <Route path="/Contact" element={<Contact />} />

                    {/* Rotta per la pagina "Packages". */}
                    <Route path="/Packages" element={<Packages />} />

                    {/* Rotta per la pagina "Review". */}
                    <Route path="/Review" element={<Review />} />

                    {/* Rotta per la pagina "Experience". */}
                    <Route path="/Experience" element={<Experience />} />

                    {/* Rotta per la pagina "Favorites". */}
                    <Route path="/Favorites" element={<Favorites />} />
                </Routes>
            </>
        </AuthProvider>
    );
}

// Esporta il componente "App" come componente principale dell'applicazione.
export default App;
