import { useNavigate } from 'react-router-dom';
import { useStore, BAG_STATUS } from '../store/useStore';
import './LoadMode.css';

const LoadMode = () => {
  const navigate = useNavigate();
  const { getFilteredBags, getBagStatus } = useStore();
  
  const bags = getFilteredBags();
  
  const handleBagClick = (bagId) => {
    navigate(`/load/bag/${bagId}`);
  };
  
  const handleScanClick = () => {
    navigate('/load/scan');
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case BAG_STATUS.LOADED:
        return 'Chargé';
      case BAG_STATUS.READY:
        return 'Prêt';
      case BAG_STATUS.EMPTY:
      default:
        return 'Vide';
    }
  };
  
  const getStatusClass = (status) => {
    switch (status) {
      case BAG_STATUS.LOADED:
        return 'loaded';
      case BAG_STATUS.READY:
        return 'ready';
      case BAG_STATUS.EMPTY:
      default:
        return 'empty';
    }
  };
  
  return (
    <div className="load-mode bags-page">
      <div className="load-mode-header">
        <h2 className="load-mode-title">Mode Chargement</h2>
        <p className="load-mode-subtitle">
          Vérifiez chaque objet et marquez les sacs comme chargés
        </p>
      </div>
      
      {bags.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎒</div>
          <h3 className="empty-state-title">Aucun sac</h3>
          <p className="empty-state-text">
            L'administrateur doit créer des sacs avant de pouvoir charger.
          </p>
        </div>
      ) : (
        <div className="load-mode-grid bags-grid">
          {bags.map((bag) => {
            const status = getBagStatus(bag.id);
            const itemCount = bag.items.length;
            const checkedCount = bag.items.filter(item => item.checked).length;
            
            return (
              <div 
                key={bag.id}
                className="bag-card"
                onClick={() => handleBagClick(bag.id)}
              >
                {bag.photo ? (
                  <img 
                    src={bag.photo} 
                    alt={bag.name}
                    className="bag-card-image"
                  />
                ) : (
                  <div className="bag-card-image placeholder">
                    🎒
                  </div>
                )}
                
                <div className="bag-card-content">
                  <div className="bag-card-header">
                    <h3 className="bag-card-name">{bag.name}</h3>
                  </div>
                  
                  <div className="bag-card-info">
                    <div>
                      {itemCount === 0 
                        ? 'Aucun objet' 
                        : `${itemCount} objet${itemCount > 1 ? 's' : ''}`
                      }
                    </div>
                    {itemCount > 0 && (
                      <div>
                        {checkedCount} / {itemCount} vérifié{checkedCount > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                  
                  <div className={`bag-status ${getStatusClass(status)}`}>
                    {getStatusLabel(status)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Floating QR Scan Button */}
      <button 
        className="floating-scan-button"
        onClick={handleScanClick}
        aria-label="Scan QR Code"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
        <span>Scanner QR</span>
      </button>
    </div>
  );
};

export default LoadMode;
