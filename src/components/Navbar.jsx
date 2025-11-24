import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useStore();
  
  const isAdminHome = location.pathname === '/admin/bags';
  
  const handleLogout = () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout();
      navigate('/');
    }
  };
  
  const handleBack = () => {
    if (location.pathname.startsWith('/admin/bag/')) {
      navigate('/admin/bags');
    } else {
      navigate(-1);
    }
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand" onClick={() => navigate('/admin/bags')} style={{ cursor: 'pointer' }}>
          <img 
            src="./public/img/Jambon.jpg" 
            alt="JambonRider" 
            className="navbar-logo"
          />
          <h1 className="navbar-title">JambonRider</h1>
        </div>
        
        <div className="navbar-actions">
          {!isAdminHome && (
            <button onClick={handleBack} className="navbar-button">
              ← Retour
            </button>
          )}
          <button onClick={handleLogout} className="navbar-button danger">
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
