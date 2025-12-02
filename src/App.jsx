import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import FallingLeaves from './components/FallingLeaves';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Classify from './pages/Classify';
import Guide from './pages/Guide';
import Gamification from './pages/Gamification';
import Social from './pages/Social';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import NearbyUsers from './pages/NearbyUsers';
import { logSupabaseStatus } from './utils/supabaseCheck';

function App() {
  useEffect(() => {
    if (import.meta.env.DEV) {
      logSupabaseStatus();
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
            <FallingLeaves />
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/classify"
                  element={
                    <ProtectedRoute>
                      <Classify />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/guide"
                  element={
                    <ProtectedRoute>
                      <Guide />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/gamification"
                  element={
                    <ProtectedRoute>
                      <Gamification />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/social"
                  element={
                    <ProtectedRoute>
                      <Social />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/:username"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/edit"
                  element={
                    <ProtectedRoute>
                      <EditProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/nearby"
                  element={
                    <ProtectedRoute>
                      <NearbyUsers />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
