import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore, BAG_STATUS } from '../store/useStore';
import './BagDetail.css';

const BagDetail = () => {
  const { bagId } = useParams();
  const navigate = useNavigate();
  const { 
    getBagById, 
    getBagStatus, 
    markBagAsLoaded, 
    deleteItem,
    toggleItemChecked
  } = useStore();
  
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const bag = getBagById(bagId);
  const status = getBagStatus(bagId);
  
  if (!bag) {
    return (
      <div className="bag-detail-page">
        <div className="empty-items-state">
          <h2>Sac introuvable</h2>
          <button onClick={() => navigate('/')}>
            Retour à l'accueil
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
  
  const handleDeleteItem = (itemId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet objet ?')) {
      deleteItem(bagId, itemId);
    }
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
          <h2 className="items-title">Objets</h2>
          <button 
            className="primary"
            onClick={() => setShowAddItemModal(true)}
          >
            + Ajouter un objet
          </button>
        </div>
        
        {bag.items.length === 0 ? (
          <div className="empty-items-state">
            <div className="empty-items-icon">📦</div>
            <h3>Aucun objet</h3>
            <p>Ajoutez des objets à ce sac pour commencer.</p>
            <button 
              className="primary"
              onClick={() => setShowAddItemModal(true)}
              style={{ marginTop: 'var(--spacing-md)' }}
            >
              + Ajouter un objet
            </button>
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
                    <div className="item-actions">
                      <button
                        className="icon-button"
                        onClick={() => setEditingItem(item)}
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button
                        className="icon-button danger"
                        onClick={() => handleDeleteItem(item.id)}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
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
      
      {showAddItemModal && (
        <AddItemModal 
          bagId={bagId} 
          onClose={() => setShowAddItemModal(false)} 
        />
      )}
      
      {editingItem && (
        <EditItemModal 
          bagId={bagId}
          item={editingItem}
          onClose={() => setEditingItem(null)} 
        />
      )}
    </div>
  );
};

// Simple Add Item Modal (will enhance with image upload later)
const AddItemModal = ({ bagId, onClose }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { addItem } = useStore();
  
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
        const tags = tagsInput
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0);
        
        await addItem(bagId, {
          name: name.trim(),
          quantity: parseInt(quantity) || 1,
          description: description.trim(),
          tags,
          photoFile // Pass the file for upload
        });
        
        onClose();
      } catch (error) {
        console.error('Error adding item:', error);
        alert('Erreur lors de l\'ajout de l\'objet');
      } finally {
        setIsUploading(false);
      }
    }
  };
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Nouvel Objet</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nom *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Caméra Sony A7III"
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
                <label htmlFor="photo-upload" className="photo-upload-label">
                  📷 Choisir une photo
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoChange}
                  className="photo-upload-input"
                />
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">Quantité</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détails supplémentaires..."
              className="form-input"
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Tags (séparés par virgule)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Ex: caméra, prioritaire, fragile"
              className="form-input"
            />
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

const EditItemModal = ({ bagId, item, onClose }) => {
  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState(item.quantity || 1);
  const [description, setDescription] = useState(item.description || '');
  const [tagsInput, setTagsInput] = useState(item.tags?.join(', ') || '');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(item.photo || null);
  const [isUploading, setIsUploading] = useState(false);
  const { updateItem } = useStore();
  
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
        const tags = tagsInput
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0);
        
        const updates = {
          name: name.trim(),
          quantity: parseInt(quantity) || 1,
          description: description.trim(),
          tags
        };
        
        // Add photo update
        if (photoFile) {
          updates.photoFile = photoFile;
        } else if (photoPreview === null && item.photo) {
          // Photo was removed
          updates.photo = null;
        }
        
        await updateItem(bagId, item.id, updates);
        onClose();
      } catch (error) {
        console.error('Error updating item:', error);
        alert('Erreur lors de la modification de l\'objet');
      } finally {
        setIsUploading(false);
      }
    }
  };
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Modifier l'Objet</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nom *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Caméra Sony A7III"
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
                <label htmlFor="edit-photo-upload" className="photo-upload-label">
                  📷 Choisir une photo
                </label>
                <input
                  id="edit-photo-upload"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoChange}
                  className="photo-upload-input"
                />
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">Quantité</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détails supplémentaires..."
              className="form-input"
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Tags (séparés par virgule)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Ex: caméra, prioritaire, fragile"
              className="form-input"
            />
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
            <button 
              type="submit" 
              className="primary" 
              style={{ flex: 1 }}
              disabled={isUploading}
            >
              {isUploading ? 'Upload...' : 'Modifier'}
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

export default BagDetail;
