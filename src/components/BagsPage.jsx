import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, BAG_STATUS } from '../store/useStore';
import './BagsPage.css';

const BagsPage = () => {
  const navigate = useNavigate();
  const { bags, deleteBag, getBagStatus } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  
  const handleBagClick = (bagId) => {
    navigate(`/admin/bag/${bagId}`);
  };
  
  const handleDeleteBag = (e, bagId) => {
    e.stopPropagation();
    if (confirm('Êtes-vous sûr de vouloir supprimer ce sac ?')) {
      deleteBag(bagId);
    }
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
    <div className="bags-page">
      <div className="bags-header">
        <h2 className="bags-title">Mes Sacs</h2>
        <button 
          className="primary"
          onClick={() => setShowAddModal(true)}
        >
          + Ajouter un sac
        </button>
      </div>
      
      {bags.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎒</div>
          <h3 className="empty-state-title">Aucun sac</h3>
          <p className="empty-state-text">
            Commencez par ajouter votre premier sac pour organiser votre matériel.
          </p>
          <button 
            className="primary"
            onClick={() => setShowAddModal(true)}
          >
            + Ajouter un sac
          </button>
        </div>
      ) : (
        <div className="bags-grid">
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
                    <div className="bag-card-actions">
                      <button
                        className="icon-button danger"
                        onClick={(e) => handleDeleteBag(e, bag.id)}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
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
      
      {showAddModal && (
        <AddBagModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};

// Simple Add Bag Modal (will enhance with image upload later)
const AddBagModal = ({ onClose }) => {
  const [name, setName] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { addBag } = useStore();
  
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim()) {
      setIsUploading(true);
      
      try {
        await addBag({ 
          name: name.trim(),
          photoFile 
        });
        onClose();
      } catch (error) {
        console.error('Error adding bag:', error);
        alert('Erreur lors de l\'ajout du sac');
      } finally {
        setIsUploading(false);
      }
    }
  };
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Nouveau Sac</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nom du sac</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Sac Caméras"
              className="form-input"
              autoFocus
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Photo</label>
            {photoPreview ? (
              <div className="photo-preview-container">
                <img src={photoPreview} alt="Preview" className="photo-preview" />
                <button 
                  type="button" 
                  onClick={handleRemovePhoto}
                  className="photo-remove-btn"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="photo-upload-container">
                <label htmlFor="bag-photo-upload" className="photo-upload-label">
                  📷 Choisir une photo
                </label>
                <input
                  id="bag-photo-upload"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoChange}
                  className="photo-upload-input"
                />
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
            <button 
              type="submit" 
              className="primary" 
              style={{ flex: 1 }}
              disabled={isUploading}
            >
              {isUploading ? 'Upload...' : 'Créer'}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              style={{ flex: 1 }}
              disabled={isUploading}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BagsPage;
