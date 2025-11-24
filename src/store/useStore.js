import { create } from 'zustand';
import { useSupabase } from '../lib/supabase';
import * as supabaseHelpers from '../lib/supabaseHelpers';

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
  isLoading: false,
  error: null,
  realtimeChannel: null,
  
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
    get().unsubscribeFromRealtime();
  },
  
  checkAuth: () => {
    const auth = localStorage.getItem('jambon_auth');
    if (auth === 'true') {
      set({ isAuthenticated: true });
    }
  },
  
  // Bag actions
  addBag: async (bag) => {
    set({ isLoading: true, error: null });
    
    try {
      if (useSupabase()) {
        // Use Supabase
        const newBag = await supabaseHelpers.createBag(bag);
        set((state) => ({
          bags: [...state.bags, newBag],
          isLoading: false
        }));
        return newBag;
      } else {
        // Use localStorage
        const newBag = {
          id: Date.now().toString(),
          name: bag.name,
          photo: bag.photo || null,
          items: [],
          loaded: false,
          createdAt: new Date().toISOString()
        };
        set((state) => ({
          bags: [...state.bags, newBag],
          isLoading: false
        }));
        get().saveBags();
        return newBag;
      }
    } catch (error) {
      console.error('Error adding bag:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  updateBag: async (bagId, updates) => {
    try {
      if (useSupabase()) {
        // Update in Supabase
        await supabaseHelpers.updateBag(bagId, updates);
        // Local state will update via realtime subscription
        set((state) => ({
          bags: state.bags.map(bag => 
            bag.id === bagId ? { ...bag, ...updates } : bag
          )
        }));
      } else {
        // Update localStorage
        set((state) => ({
          bags: state.bags.map(bag => 
            bag.id === bagId ? { ...bag, ...updates } : bag
          )
        }));
        get().saveBags();
      }
    } catch (error) {
      console.error('Error updating bag:', error);
      set({ error: error.message });
      throw error;
    }
  },
  
  deleteBag: async (bagId) => {
    try {
      if (useSupabase()) {
        // Delete from Supabase
        await supabaseHelpers.deleteBag(bagId);
        // Local state will update via realtime subscription
        set((state) => ({
          bags: state.bags.filter(bag => bag.id !== bagId)
        }));
      } else {
        // Delete from localStorage
        set((state) => ({
          bags: state.bags.filter(bag => bag.id !== bagId)
        }));
        get().saveBags();
      }
    } catch (error) {
      console.error('Error deleting bag:', error);
      set({ error: error.message });
      throw error;
    }
  },
  
  markBagAsLoaded: async (bagId, loaded = true) => {
    await get().updateBag(bagId, { loaded });
  },
  
  // Item actions
  addItem: async (bagId, item) => {
    set({ isLoading: true, error: null });
    
    try {
      if (useSupabase()) {
        // Use Supabase
        const newItem = await supabaseHelpers.createItem(bagId, item);
        set((state) => ({
          bags: state.bags.map(bag => {
            if (bag.id === bagId) {
              return {
                ...bag,
                items: [...bag.items, newItem]
              };
            }
            return bag;
          }),
          isLoading: false
        }));
        return newItem;
      } else {
        // Use localStorage
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
          }),
          isLoading: false
        }));
        get().saveBags();
        return newItem;
      }
    } catch (error) {
      console.error('Error adding item:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  updateItem: async (bagId, itemId, updates) => {
    try {
      if (useSupabase()) {
        // Update in Supabase
        await supabaseHelpers.updateItem(itemId, updates);
        // Local state will update via realtime subscription
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
      } else {
        // Update localStorage
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
      }
    } catch (error) {
      console.error('Error updating item:', error);
      set({ error: error.message });
      throw error;
    }
  },
  
  deleteItem: async (bagId, itemId) => {
    try {
      if (useSupabase()) {
        // Delete from Supabase
        await supabaseHelpers.deleteItem(itemId);
        // Local state will update via realtime subscription
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
      } else {
        // Delete from localStorage
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
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      set({ error: error.message });
      throw error;
    }
  },
  
  toggleItemChecked: async (bagId, itemId) => {
    const bag = get().getBagById(bagId);
    if (!bag) return;
    
    const item = bag.items.find(i => i.id === itemId);
    if (!item) return;
    
    await get().updateItem(bagId, itemId, { checked: !item.checked });
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
    if (!useSupabase()) {
      const { bags } = get();
      localStorage.setItem('jambon_bags', JSON.stringify(bags));
    }
  },
  
  loadBags: async () => {
    set({ isLoading: true, error: null });
    
    try {
      if (useSupabase()) {
        // Load from Supabase
        const bags = await supabaseHelpers.fetchBags();
        if (bags) {
          set({ bags, isLoading: false });
          // Subscribe to realtime updates
          get().subscribeToRealtime();
        }
      } else {
        // Load from localStorage
        const saved = localStorage.getItem('jambon_bags');
        if (saved) {
          try {
            const bags = JSON.parse(saved);
            set({ bags, isLoading: false });
          } catch (e) {
            console.error('Error loading bags:', e);
            set({ isLoading: false });
          }
        } else {
          set({ isLoading: false });
        }
      }
    } catch (error) {
      console.error('Error loading bags:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  // Realtime subscription
  subscribeToRealtime: () => {
    if (!useSupabase()) return;
    
    const channel = supabaseHelpers.subscribeToBags(async () => {
      // Reload data when changes occur
      try {
        const bags = await supabaseHelpers.fetchBags();
        if (bags) {
          set({ bags });
        }
      } catch (error) {
        console.error('Error syncing realtime data:', error);
      }
    });
    
    set({ realtimeChannel: channel });
  },
  
  unsubscribeFromRealtime: () => {
    const { realtimeChannel } = get();
    if (realtimeChannel) {
      supabaseHelpers.unsubscribeFromBags(realtimeChannel);
      set({ realtimeChannel: null });
    }
  },
  
  // Reset all data (for testing)
  resetData: () => {
    set({ bags: [] });
    localStorage.removeItem('jambon_bags');
  }
}));
