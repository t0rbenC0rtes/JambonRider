import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const LoadNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isLoadHome = location.pathname === '/load';
  
  const handleBack = () => {
    if (isLoadHome) {
      navigate('/');
    } else {
      navigate('/load');
    }
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <img 
            src="/img/Jambon.jpg" 
            alt="JambonRider" 
            className="navbar-logo"
          />
          <h1 className="navbar-title">JambonRider - Chargement</h1>
        </div>
        
        <div className="navbar-actions">
          <button onClick={handleBack} className="navbar-button">
            ← {isLoadHome ? 'Accueil' : 'Retour'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default LoadNavbar;
