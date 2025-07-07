
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { MapPage } from './pages/MapPage';
import { PrivateRoute } from './Components/routing/PrivateRoute';
import { Navbar } from './Components/Navbar';
import { socket } from './socket';
import { Toaster } from 'react-hot-toast'; 

import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

function App() {

  useEffect(() => {

    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <div className="App">
       <Toaster 
        position="top-right" 
        toastOptions={{
          success: { style: { background: 'green', color: 'white' } },
          error: { style: { background: 'red', color: 'white' } }
        }}
      />

      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<MapPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/admin/dashboard' element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
