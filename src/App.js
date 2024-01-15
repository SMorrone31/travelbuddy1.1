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


function App() {
    return (
        <AuthProvider>
            <>
                <NotificationManager />
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home2 />} />
                    <Route path="/About" element={<About />} />
                    <Route path="/Contact" element={<Contact />} />
                    <Route path="/Packages" element={<Packages />} />
                    <Route path="/Review" element={<Review />} />
                    <Route path="/Experience" element={<Experience />} />
                    <Route path="/Favorites" element={<Favorites />} />
                </Routes>
            </>
        </AuthProvider>

    );
}

export default App;
