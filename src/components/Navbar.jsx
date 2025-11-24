import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useStore();
  
  const isHomePage = location.pathname === '/';
  
  const handleLogout = () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout();
      navigate('/login');
    }
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img 
            src="./img/jambon.jpg" 
            alt="JambonRider" 
            className="navbar-logo"
          />
          <h1 className="navbar-title">JambonRider</h1>
        </div>
        
        <div className="navbar-actions">
          {!isHomePage && (
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
