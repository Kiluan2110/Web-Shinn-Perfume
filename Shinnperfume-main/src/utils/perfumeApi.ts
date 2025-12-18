import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-335e3812`;

export interface Perfume {
  id: number;
  category: 'her' | 'him';
  name: string;
  subtitle: string;
  tagline: string;
  description: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  image: string;
}

// Fetch perfumes by category
export async function fetchPerfumesByCategory(category: 'her' | 'him'): Promise<Perfume[]> {
  try {
    const response = await fetch(`${API_BASE}/perfumes/${category}`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch perfumes: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error(`Error fetching ${category} perfumes:`, error);
    return [];
  }
}

// Initialize database with default data
export async function initializePerfumeData(perfumes: Perfume[]): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/init-data`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ perfumes }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to initialize data: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log(`Initialized ${result.count} perfumes in database`);
    return true;
  } catch (error) {
    console.error('Error initializing perfume data:', error);
    return false;
  }
}

// Add a new perfume
export async function addPerfume(perfume: Perfume): Promise<Perfume | null> {
  try {
    const response = await fetch(`${API_BASE}/perfumes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(perfume),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add perfume: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error adding perfume:', error);
    return null;
  }
}

// Update a perfume
export async function updatePerfume(category: 'her' | 'him', id: number, updates: Partial<Perfume>): Promise<Perfume | null> {
  try {
    const response = await fetch(`${API_BASE}/perfumes/${category}/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update perfume: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error updating perfume:', error);
    return null;
  }
}

// Delete a perfume
export async function deletePerfume(category: 'her' | 'him', id: number): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/perfumes/${category}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete perfume: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting perfume:', error);
    return false;
  }
}

// Debug: Fetch all raw data from KV store
export async function fetchAllRawData(): Promise<any> {
  try {
    const response = await fetch(`${API_BASE}/debug/all-data`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch raw data: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching raw data:', error);
    return { error: String(error) };
  }
}

// Debug: Clear all data
export async function clearAllData(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/debug/clear-all`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to clear data: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
}