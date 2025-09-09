import { supabase } from '../lib/supabase';

export const projectService = {
  async getAllProjects() {
    try {
      const { data, error } = await supabase?.from('projects')?.select(`
          *,
          project_manager:user_profiles(id, full_name, email),
          project_assignments(
            user:user_profiles(id, full_name, email, role)
          )
        `)?.order('created_at', { ascending: false });
      
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

  async getProjectById(id) {
    try {
      const { data, error } = await supabase?.from('projects')?.select(`
          *,
          project_manager:user_profiles(id, full_name, email),
          project_assignments(
            user:user_profiles(id, full_name, email, role),
            assigned_date,
            is_active
          )
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

  async createProject(projectData) {
    try {
      const { data, error } = await supabase?.from('projects')?.insert([projectData])?.select()?.single();
      
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

  async updateProject(id, projectData) {
    try {
      const { data, error } = await supabase?.from('projects')?.update({ ...projectData, updated_at: new Date() })?.eq('id', id)?.select()?.single();
      
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

  async deleteProject(id) {
    try {
      const { error } = await supabase?.from('projects')?.delete()?.eq('id', id);
      
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

  async getUserProjects(userId) {
    try {
      const { data, error } = await supabase?.from('projects')?.select(`
          *,
          project_manager:user_profiles(id, full_name, email)
        `)?.or(`project_manager_id.eq.${userId},id.in.(${await this.getUserAssignedProjectIds(userId)})`)?.order('created_at', { ascending: false });
      
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

  async getUserAssignedProjectIds(userId) {
    try {
      const { data, error } = await supabase?.from('project_assignments')?.select('project_id')?.eq('user_id', userId)?.eq('is_active', true);
      
      if (error) {
        return [];
      }
      
      return data?.map(assignment => assignment?.project_id)?.join(',') || '';
    } catch (error) {
      return [];
    }
  },

  async assignUserToProject(projectId, userId) {
    try {
      const { data, error } = await supabase?.from('project_assignments')?.insert([{
          project_id: projectId,
          user_id: userId,
          is_active: true
        }])?.select()?.single();
      
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

  async removeUserFromProject(projectId, userId) {
    try {
      const { error } = await supabase?.from('project_assignments')?.update({ is_active: false })?.eq('project_id', projectId)?.eq('user_id', userId);
      
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
  }
};