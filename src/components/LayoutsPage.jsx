import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import './LayoutsPage.css';

const LayoutsPage = () => {
  const navigate = useNavigate();
  const { 
    bags,
    layouts, 
    activeLayout,
    loadLayouts,
    setActiveLayout,
    deleteLayout,
    getLayoutCompletion
  } = useStore();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingLayout, setEditingLayout] = useState(null);
  
  useEffect(() => {
    loadLayouts();
  }, [loadLayouts]);
  
  const handleSetActive = async (layoutId) => {
    if (confirm('Activer ce layout ? Tous les items seront décochés.')) {
      try {
        await setActiveLayout(layoutId);
      } catch (error) {
        alert('Erreur lors de l\'activation du layout');
      }
    }
  };
  
  const handleDeactivate = async () => {
    if (confirm('Désactiver le layout actif ? Tous les sacs seront visibles.')) {
      try {
        await setActiveLayout(null);
      } catch (error) {
        alert('Erreur lors de la désactivation');
      }
    }
  };
  
  const handleDelete = async (e, layoutId) => {
    e.stopPropagation();
    if (confirm('Supprimer ce layout ?')) {
      try {
        await deleteLayout(layoutId);
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };
  
  const handleEdit = (e, layout) => {
    e.stopPropagation();
    setEditingLayout(layout);
  };
  
  // All Bags pseudo-layout
  const allBagsLayout = {
    id: 'all',
    name: 'Tous les sacs',
    bagIds: bags.map(b => b.id),
    isActive: !activeLayout,
    isDefault: true
  };
  
  const allLayouts = [allBagsLayout, ...layouts];
  
  return (
    <div className="layouts-page">
      <div className="layouts-header">
        <h1 className="layouts-title">Gestion des Layouts</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="primary"
        >
          + Créer un layout
        </button>
      </div>
      
      <div className="layouts-grid">
        {allLayouts.map((layout) => {
          const bagCount = layout.bagIds.length;
          const completion = layout.isDefault ? 0 : getLayoutCompletion(layout.id);
          const layoutBags = bags.filter(bag => layout.bagIds.includes(bag.id));
          
          return (
            <div 
              key={layout.id}
              className={`layout-card ${layout.isActive ? 'active' : ''}`}
            >
              <div className="layout-card-header">
                <h3 className="layout-card-name">
                  {layout.name}
                  {layout.isActive && <span className="active-badge">Actif</span>}
                </h3>
                {!layout.isDefault && (
                  <div className="layout-card-actions">
                    <button
                      className="icon-button"
                      onClick={(e) => handleEdit(e, layout)}
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <button
                      className="icon-button danger"
                      onClick={(e) => handleDelete(e, layout.id)}
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
              
              <div className="layout-card-info">
                <div>{bagCount} sac{bagCount > 1 ? 's' : ''}</div>
                {!layout.isDefault && completion > 0 && (
                  <div className="layout-completion">
                    {completion}% chargé
                  </div>
                )}
              </div>
              
              {layoutBags.length > 0 && (
                <div className="layout-bag-previews">
                  {layoutBags.slice(0, 4).map((bag) => (
                    <div key={bag.id} className="layout-bag-preview">
                      {bag.photo ? (
                        <img src={bag.photo} alt={bag.name} />
                      ) : (
                        <div className="layout-bag-preview-placeholder">🎒</div>
                      )}
                    </div>
                  ))}
                  {layoutBags.length > 4 && (
                    <div className="layout-bag-preview-more">
                      +{layoutBags.length - 4}
                    </div>
                  )}
                </div>
              )}
              
              <div className="layout-card-actions-bottom">
                {layout.isActive ? (
                  <button 
                    onClick={handleDeactivate}
                    className="danger"
                  >
                    Désactiver
                  </button>
                ) : (
                  <button 
                    onClick={() => handleSetActive(layout.id === 'all' ? null : layout.id)}
                    className="primary"
                  >
                    Activer
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {showCreateModal && (
        <LayoutModal 
          onClose={() => setShowCreateModal(false)} 
        />
      )}
      
      {editingLayout && (
        <LayoutModal 
          layout={editingLayout}
          onClose={() => setEditingLayout(null)} 
        />
      )}
    </div>
  );
};

const LayoutModal = ({ layout, onClose }) => {
  const { bags, addLayout, updateLayout } = useStore();
  const [name, setName] = useState(layout?.name || '');
  const [selectedBagIds, setSelectedBagIds] = useState(layout?.bagIds || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  
  const isEdit = !!layout;
  
  useEffect(() => {
    if (selectAll) {
      setSelectedBagIds(bags.map(b => b.id));
    }
  }, [selectAll, bags]);
  
  const toggleBag = (bagId) => {
    setSelectedBagIds(prev => 
      prev.includes(bagId) 
        ? prev.filter(id => id !== bagId)
        : [...prev, bagId]
    );
  };
  
  const toggleSelectAll = () => {
    if (selectedBagIds.length === bags.length) {
      setSelectedBagIds([]);
      setSelectAll(false);
    } else {
      setSelectedBagIds(bags.map(b => b.id));
      setSelectAll(true);
    }
  };
  
  const filteredBags = bags.filter(bag => 
    bag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim() && selectedBagIds.length > 0) {
      try {
        if (isEdit) {
          await updateLayout(layout.id, { name: name.trim(), bagIds: selectedBagIds });
        } else {
          await addLayout({ name: name.trim(), bagIds: selectedBagIds });
        }
        onClose();
      } catch (error) {
        alert('Erreur lors de l\'enregistrement');
      }
    }
  };
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content layout-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{isEdit ? 'Modifier le Layout' : 'Nouveau Layout'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nom du layout *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Lumières"
              className="form-input"
              autoFocus
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">
              Sacs ({selectedBagIds.length} sélectionné{selectedBagIds.length > 1 ? 's' : ''})
            </label>
            
            <div className="layout-bag-controls">
              <button 
                type="button" 
                onClick={toggleSelectAll}
                className="select-all-button"
              >
                {selectedBagIds.length === bags.length ? '✓ Tout désélectionner' : '☐ Tout sélectionner'}
              </button>
              
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Rechercher un sac..."
                className="form-input"
              />
            </div>
            
            <div className="layout-bag-list">
              {filteredBags.map((bag) => (
                <div 
                  key={bag.id}
                  className={`layout-bag-item ${selectedBagIds.includes(bag.id) ? 'selected' : ''}`}
                  onClick={() => toggleBag(bag.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedBagIds.includes(bag.id)}
                    onChange={() => toggleBag(bag.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  {bag.photo ? (
                    <img src={bag.photo} alt={bag.name} className="layout-bag-item-image" />
                  ) : (
                    <div className="layout-bag-item-placeholder">🎒</div>
                  )}
                  <span className="layout-bag-item-name">{bag.name}</span>
                  <span className="layout-bag-item-count">
                    {bag.items.length} objet{bag.items.length > 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
            <button 
              type="submit" 
              className="primary" 
              style={{ flex: 1 }}
              disabled={selectedBagIds.length === 0}
            >
              {isEdit ? 'Modifier' : 'Créer'}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              style={{ flex: 1 }}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LayoutsPage;
