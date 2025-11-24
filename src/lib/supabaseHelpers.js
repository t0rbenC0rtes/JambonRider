import { supabase, useSupabase } from './supabase';

// ============= BAGS =============

export const fetchBags = async () => {
  if (!useSupabase()) return null;
  
  const { data, error } = await supabase
    .from('bags')
    .select(`
      *,
      items (*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  // Transform to match our local format
  return data.map(bag => ({
    id: bag.id,
    name: bag.name,
    photo: bag.photo_url,
    loaded: bag.loaded,
    items: bag.items.map(item => ({
      id: item.id,
      name: item.name,
      photo: item.photo_url,
      quantity: item.quantity,
      description: item.description,
      tags: item.tags || [],
      checked: item.checked,
      createdAt: item.created_at
    })),
    createdAt: bag.created_at
  }));
};

export const createBag = async (bag) => {
  if (!useSupabase()) return null;
  
  const { data, error } = await supabase
    .from('bags')
    .insert([{
      name: bag.name,
      photo_url: bag.photo,
      loaded: false
    }])
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    name: data.name,
    photo: data.photo_url,
    loaded: data.loaded,
    items: [],
    createdAt: data.created_at
  };
};

export const updateBag = async (bagId, updates) => {
  if (!useSupabase()) return null;
  
  const dbUpdates = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.photo !== undefined) dbUpdates.photo_url = updates.photo;
  if (updates.loaded !== undefined) dbUpdates.loaded = updates.loaded;
  
  const { data, error } = await supabase
    .from('bags')
    .update(dbUpdates)
    .eq('id', bagId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteBag = async (bagId) => {
  if (!useSupabase()) return null;
  
  const { error } = await supabase
    .from('bags')
    .delete()
    .eq('id', bagId);
  
  if (error) throw error;
};

// ============= ITEMS =============

export const createItem = async (bagId, item) => {
  if (!useSupabase()) return null;
  
  const { data, error } = await supabase
    .from('items')
    .insert([{
      bag_id: bagId,
      name: item.name,
      photo_url: item.photo,
      quantity: item.quantity || 1,
      description: item.description || '',
      tags: item.tags || [],
      checked: false
    }])
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    name: data.name,
    photo: data.photo_url,
    quantity: data.quantity,
    description: data.description,
    tags: data.tags || [],
    checked: data.checked,
    createdAt: data.created_at
  };
};

export const updateItem = async (itemId, updates) => {
  if (!useSupabase()) return null;
  
  const dbUpdates = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.photo !== undefined) dbUpdates.photo_url = updates.photo;
  if (updates.quantity !== undefined) dbUpdates.quantity = updates.quantity;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
  if (updates.checked !== undefined) dbUpdates.checked = updates.checked;
  
  const { data, error } = await supabase
    .from('items')
    .update(dbUpdates)
    .eq('id', itemId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteItem = async (itemId) => {
  if (!useSupabase()) return null;
  
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', itemId);
  
  if (error) throw error;
};

// ============= REALTIME =============

export const subscribeToBags = (callback) => {
  if (!useSupabase()) return null;
  
  const channel = supabase
    .channel('bags_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'bags' },
      callback
    )
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'items' },
      callback
    )
    .subscribe();
  
  return channel;
};

export const unsubscribeFromBags = (channel) => {
  if (channel) {
    supabase.removeChannel(channel);
  }
};
