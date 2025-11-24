import { create } from 'zustand';

// Types
export const BAG_STATUS = {
  EMPTY: 'empty',
  READY: 'ready',
  LOADED: 'loaded'
};

// Helper to check if all items in a bag are checked
const areAllItemsChecked = (items) => {
  return items.length > 0 && items.every(item => item.checked);
};

// Helper to determine bag status
const getBagStatus = (bag) => {
  if (bag.loaded) return BAG_STATUS.LOADED;
  if (areAllItemsChecked(bag.items)) return BAG_STATUS.READY;
  return BAG_STATUS.EMPTY;
};

export const useStore = create((set, get) => ({
  // Auth state
  isAuthenticated: false,
  
  // Data state
  bags: [],
  
  // Auth actions
  login: (password) => {
    const correctPassword = import.meta.env.VITE_APP_PASSWORD;
    if (password === correctPassword) {
      set({ isAuthenticated: true });
      localStorage.setItem('jambon_auth', 'true');
      return true;
    }
    return false;
  },
  
  logout: () => {
    set({ isAuthenticated: false });
    localStorage.removeItem('jambon_auth');
  },
  
  checkAuth: () => {
    const auth = localStorage.getItem('jambon_auth');
    if (auth === 'true') {
      set({ isAuthenticated: true });
    }
  },
  
  // Bag actions
  addBag: (bag) => {
    const newBag = {
      id: Date.now().toString(),
      name: bag.name,
      photo: bag.photo || null,
      items: [],
      loaded: false,
      createdAt: new Date().toISOString()
    };
    set((state) => ({
      bags: [...state.bags, newBag]
    }));
    get().saveBags();
    return newBag;
  },
  
  updateBag: (bagId, updates) => {
    set((state) => ({
      bags: state.bags.map(bag => 
        bag.id === bagId ? { ...bag, ...updates } : bag
      )
    }));
    get().saveBags();
  },
  
  deleteBag: (bagId) => {
    set((state) => ({
      bags: state.bags.filter(bag => bag.id !== bagId)
    }));
    get().saveBags();
  },
  
  markBagAsLoaded: (bagId, loaded = true) => {
    set((state) => ({
      bags: state.bags.map(bag => 
        bag.id === bagId ? { ...bag, loaded } : bag
      )
    }));
    get().saveBags();
  },
  
  // Item actions
  addItem: (bagId, item) => {
    const newItem = {
      id: Date.now().toString(),
      name: item.name,
      photo: item.photo || null,
      quantity: item.quantity || 1,
      description: item.description || '',
      tags: item.tags || [],
      checked: false,
      createdAt: new Date().toISOString()
    };
    
    set((state) => ({
      bags: state.bags.map(bag => {
        if (bag.id === bagId) {
          return {
            ...bag,
            items: [...bag.items, newItem]
          };
        }
        return bag;
      })
    }));
    get().saveBags();
    return newItem;
  },
  
  updateItem: (bagId, itemId, updates) => {
    set((state) => ({
      bags: state.bags.map(bag => {
        if (bag.id === bagId) {
          return {
            ...bag,
            items: bag.items.map(item => 
              item.id === itemId ? { ...item, ...updates } : item
            )
          };
        }
        return bag;
      })
    }));
    get().saveBags();
  },
  
  deleteItem: (bagId, itemId) => {
    set((state) => ({
      bags: state.bags.map(bag => {
        if (bag.id === bagId) {
          return {
            ...bag,
            items: bag.items.filter(item => item.id !== itemId)
          };
        }
        return bag;
      })
    }));
    get().saveBags();
  },
  
  toggleItemChecked: (bagId, itemId) => {
    set((state) => ({
      bags: state.bags.map(bag => {
        if (bag.id === bagId) {
          return {
            ...bag,
            items: bag.items.map(item => 
              item.id === itemId ? { ...item, checked: !item.checked } : item
            )
          };
        }
        return bag;
      })
    }));
    get().saveBags();
  },
  
  // Utility actions
  getBagById: (bagId) => {
    return get().bags.find(bag => bag.id === bagId);
  },
  
  getBagStatus: (bagId) => {
    const bag = get().getBagById(bagId);
    return bag ? getBagStatus(bag) : BAG_STATUS.EMPTY;
  },
  
  // LocalStorage persistence
  saveBags: () => {
    const { bags } = get();
    localStorage.setItem('jambon_bags', JSON.stringify(bags));
  },
  
  loadBags: () => {
    const saved = localStorage.getItem('jambon_bags');
    if (saved) {
      try {
        const bags = JSON.parse(saved);
        set({ bags });
      } catch (e) {
        console.error('Error loading bags:', e);
      }
    }
  },
  
  // Reset all data (for testing)
  resetData: () => {
    set({ bags: [] });
    localStorage.removeItem('jambon_bags');
  }
}));
