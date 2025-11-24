import { useNavigate } from 'react-router-dom';
import './Homepage.css';

const Homepage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="homepage">
      <div className="homepage-content">
        <img 
          src="/img/jambon.jpg" 
          alt="JambonRider Logo" 
          className="homepage-logo"
        />
        <h1 className="homepage-title">JambonRider</h1>
        <p className="homepage-subtitle">
          Gestion de matériel vidéo
        </p>
        
        <div className="homepage-buttons">
          <button 
            className="homepage-button load primary"
            onClick={() => navigate('/load')}
          >
            <span className="homepage-button-text">
              <span className="homepage-button-icon">📦</span>
              Charger
            </span>
          </button>
          
          <button 
            className="homepage-button admin"
            onClick={() => navigate('/admin')}
          >
            <span className="homepage-button-text">
              <span className="homepage-button-icon">⚙️</span>
              Admin
            </span>
          </button>
        </div>
        
        <p className="homepage-footer">
          Mode Charger : Vérifier et charger le matériel<br />
          Mode Admin : Gérer les sacs et objets
        </p>
      </div>
    </div>
  );
};

export default Homepage;
