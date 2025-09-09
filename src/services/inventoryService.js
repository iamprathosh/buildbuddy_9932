import { supabase } from '../lib/supabase';

export const inventoryService = {
  // Products
  async getAllProducts() {
    try {
      const { data, error } = await supabase?.from('products')?.select(`
          *,
          category:product_categories(id, name)
        `)?.eq('is_active', true)?.order('name');
      
      if (error) {
        return { data: null, error: error?.message };
      }
      
      return { data, error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          data: null, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { data: null, error: error?.message };
    }
  },

  async getProductById(id) {
    try {
      const { data, error } = await supabase?.from('products')?.select(`
          *,
          category:product_categories(id, name)
        `)?.eq('id', id)?.single();
      
      if (error) {
        return { data: null, error: error?.message };
      }
      
      return { data, error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          data: null, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { data: null, error: error?.message };
    }
  },

  async createProduct(productData) {
    try {
      const { data, error } = await supabase?.from('products')?.insert([productData])?.select()?.single();
      
      if (error) {
        return { data: null, error: error?.message };
      }
      
      return { data, error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          data: null, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { data: null, error: error?.message };
    }
  },

  async updateProduct(id, productData) {
    try {
      const { data, error } = await supabase?.from('products')?.update({ ...productData, updated_at: new Date() })?.eq('id', id)?.select()?.single();
      
      if (error) {
        return { data: null, error: error?.message };
      }
      
      return { data, error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          data: null, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { data: null, error: error?.message };
    }
  },

  async deleteProduct(id) {
    try {
      const { error } = await supabase?.from('products')?.update({ is_active: false, updated_at: new Date() })?.eq('id', id);
      
      if (error) {
        return { error: error?.message };
      }
      
      return { error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { error: error?.message };
    }
  },

  // Categories
  async getAllCategories() {
    try {
      const { data, error } = await supabase?.from('product_categories')?.select('*')?.order('name');
      
      if (error) {
        return { data: null, error: error?.message };
      }
      
      return { data, error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          data: null, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { data: null, error: error?.message };
    }
  },

  // Stock Transactions
  async createStockTransaction(transactionData) {
    try {
      const { data, error } = await supabase?.from('stock_transactions')?.insert([transactionData])?.select(`
          *,
          product:products(name, sku),
          project:projects(name, job_number),
          user:user_profiles(full_name)
        `)?.single();
      
      if (error) {
        return { data: null, error: error?.message };
      }
      
      return { data, error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          data: null, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { data: null, error: error?.message };
    }
  },

  async getStockTransactions(filters = {}) {
    try {
      let query = supabase?.from('stock_transactions')?.select(`
          *,
          product:products(name, sku),
          project:projects(name, job_number),
          user:user_profiles(full_name)
        `)?.order('transaction_date', { ascending: false });

      // Apply filters
      if (filters?.product_id) {
        query = query?.eq('product_id', filters?.product_id);
      }
      if (filters?.project_id) {
        query = query?.eq('project_id', filters?.project_id);
      }
      if (filters?.transaction_type) {
        query = query?.eq('transaction_type', filters?.transaction_type);
      }
      if (filters?.user_id) {
        query = query?.eq('user_id', filters?.user_id);
      }

      const { data, error } = await query;
      
      if (error) {
        return { data: null, error: error?.message };
      }
      
      return { data, error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          data: null, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { data: null, error: error?.message };
    }
  }
};