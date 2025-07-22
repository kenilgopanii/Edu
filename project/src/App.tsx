import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PetListings from './pages/PetListings';
import PetDetails from './pages/PetDetails';
import LostFound from './pages/LostFound';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AddPet from './pages/AddPet';
import ReportLostPet from './pages/ReportLostPet';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pets" element={<PetListings />} />
              <Route path="/pets/:id" element={<PetDetails />} />
              <Route path="/lost-found" element={<LostFound />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/add-pet" element={<AddPet />} />
              <Route path="/report-lost" element={<ReportLostPet />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;