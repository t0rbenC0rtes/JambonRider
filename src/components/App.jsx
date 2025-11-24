import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import Navbar from './Navbar';
import Login from './Login';
import BagsPage from './BagsPage';
import BagDetail from './BagDetail';
import '../styles/App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const { isAuthenticated, checkAuth, loadBags } = useStore();

  useEffect(() => {
    // Check auth status on mount
    checkAuth();
    // Load bags from localStorage
    loadBags();
  }, [checkAuth, loadBags]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" replace /> : <Login />
        } />
        
        <Route path="/" element={
          <ProtectedRoute>
            <>
              <Navbar />
              <BagsPage />
            </>
          </ProtectedRoute>
        } />
        
        <Route path="/bag/:bagId" element={
          <ProtectedRoute>
            <>
              <Navbar />
              <BagDetail />
            </>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
