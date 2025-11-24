import { useParams, useNavigate } from 'react-router-dom';
import { useStore, BAG_STATUS } from '../store/useStore';
import '../components/BagDetail.css';

const LoadBagDetail = () => {
  const { bagId } = useParams();
  const navigate = useNavigate();
  const { 
    getBagById, 
    getBagStatus, 
    markBagAsLoaded,
    toggleItemChecked
  } = useStore();
  
  const bag = getBagById(bagId);
  const status = getBagStatus(bagId);
  
  if (!bag) {
    return (
      <div className="bag-detail-page">
        <div className="empty-items-state">
          <h2>Sac introuvable</h2>
          <button onClick={() => navigate('/load')}>
            Retour
          </button>
        </div>
      </div>
    );
  }
  
  const itemCount = bag.items.length;
  const checkedCount = bag.items.filter(item => item.checked).length;
  const progress = itemCount > 0 ? (checkedCount / itemCount) * 100 : 0;
  const isFullyChecked = itemCount > 0 && checkedCount === itemCount;
  
  const handleMarkAsLoaded = () => {
    if (!isFullyChecked) {
      alert('Veuillez vérifier tous les objets avant de marquer le sac comme chargé.');
      return;
    }
    markBagAsLoaded(bagId, true);
  };
  
  const handleUnmarkAsLoaded = () => {
    markBagAsLoaded(bagId, false);
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case BAG_STATUS.LOADED:
        return '✅ Chargé';
      case BAG_STATUS.READY:
        return '✓ Prêt';
      case BAG_STATUS.EMPTY:
      default:
        return 'Vide';
    }
  };
  
  return (
    <div className="bag-detail-page">
      <div className="bag-detail-header">
        <div className="bag-detail-top">
          <div className="bag-detail-info">
            <h1 className="bag-detail-title">{bag.name}</h1>
            <div className="bag-detail-meta">
              <div>
                {itemCount === 0 
                  ? 'Aucun objet' 
                  : `${itemCount} objet${itemCount > 1 ? 's' : ''}`
                }
              </div>
              <div>Statut: <strong>{getStatusLabel(status)}</strong></div>
            </div>
          </div>
          
          <div className="bag-detail-actions">
            {status === BAG_STATUS.LOADED ? (
              <button 
                onClick={handleUnmarkAsLoaded}
                className="danger"
              >
                ↻ Décharger
              </button>
            ) : (
              <button 
                onClick={handleMarkAsLoaded}
                className="primary"
                disabled={!isFullyChecked}
                title={!isFullyChecked ? 'Vérifiez tous les objets d\'abord' : ''}
              >
                ✓ Marquer comme chargé
              </button>
            )}
          </div>
        </div>
        
        {itemCount > 0 && (
          <div className="progress-bar-container">
            <div 
              className="progress-bar" 
              style={{ width: `${progress}%` }}
            >
              {checkedCount} / {itemCount}
            </div>
          </div>
        )}
      </div>
      
      <div className="items-section">
        <div className="items-header">
          <h2 className="items-title">Objets à vérifier</h2>
        </div>
        
        {bag.items.length === 0 ? (
          <div className="empty-items-state">
            <div className="empty-items-icon">📦</div>
            <h3>Aucun objet dans ce sac</h3>
            <p>L'administrateur doit ajouter des objets.</p>
          </div>
        ) : (
          <div className="items-list">
            {bag.items.map((item) => (
              <div 
                key={item.id} 
                className={`item-card ${item.checked ? 'checked' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleItemChecked(bagId, item.id)}
                  className="item-checkbox"
                />
                
                {item.photo ? (
                  <img 
                    src={item.photo} 
                    alt={item.name}
                    className="item-image"
                  />
                ) : (
                  <div className="item-image placeholder">
                    📦
                  </div>
                )}
                
                <div className="item-details">
                  <div className="item-header">
                    <h3 className="item-name">{item.name}</h3>
                  </div>
                  
                  <div className="item-meta">
                    {item.quantity && item.quantity > 1 && (
                      <div>Quantité: {item.quantity}</div>
                    )}
                    {item.description && (
                      <div>{item.description}</div>
                    )}
                  </div>
                  
                  {item.tags && item.tags.length > 0 && (
                    <div className="item-tags">
                      {item.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadBagDetail;
