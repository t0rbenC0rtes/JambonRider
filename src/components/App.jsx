import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import Navbar from './Navbar';
import LoadNavbar from './LoadNavbar';
import Homepage from './Homepage';
import Login from './Login';
import BagsPage from './BagsPage';
import BagDetail from './BagDetail';
import LoadMode from './LoadMode';
import LoadBagDetail from './LoadBagDetail';
import '../styles/App.css';

// Protected Route for Admin
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }
  
  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  const { isAuthenticated, checkAuth, loadBags } = useStore();

  useEffect(() => {
    // Check auth status on mount
    checkAuth();
    // Load bags from Supabase/localStorage
    loadBags();
  }, [checkAuth, loadBags]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Homepage - Mode Selection */}
        <Route path="/" element={<Homepage />} />
        
        {/* Admin Login */}
        <Route path="/admin" element={
          isAuthenticated ? <Navigate to="/admin/bags" replace /> : <Login mode="admin" />
        } />
        
        {/* Admin Routes - Protected */}
        <Route path="/admin/bags" element={
          <AdminRoute>
            <>
              <Navbar />
              <BagsPage />
            </>
          </AdminRoute>
        } />
        
        <Route path="/admin/bag/:bagId" element={
          <AdminRoute>
            <>
              <Navbar />
              <BagDetail />
            </>
          </AdminRoute>
        } />
        
        {/* Load Mode Routes - Public */}
        <Route path="/load" element={
          <>
            <LoadNavbar />
            <LoadMode />
          </>
        } />
        
        <Route path="/load/bag/:bagId" element={
          <>
            <LoadNavbar />
            <LoadBagDetail />
          </>
        } />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
