import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Deal {
  id: number;
  title: string;
  brand: string;
  originalPrice: number;
  dealPrice: number;
  discount: string;
  rating: number;
  reviews: number;
  image: string;
  expiresIn: string;
  category: string;
  offerUrl: string;
}

interface DealsContextType {
  deals: Deal[];
  addDeal: (deal: Omit<Deal, 'id'>) => void;
  bulkAddDeals: (deals: Omit<Deal, 'id'>[]) => Promise<{ success: boolean; error?: string }>;
  updateDeal: (id: number, deal: Partial<Deal>) => void;
  deleteDeal: (id: number) => void;
}

const DealsContext = createContext<DealsContextType | undefined>(undefined);

export function DealsProvider({ children }: { children: React.ReactNode }) {
  const [deals, setDeals] = useState<Deal[]>([]);

  // Fetch deals on mount
  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async (retries = 3) => {
    try {
      const response = await fetch('/api/deals');
      if (response.ok) {
        const data = await response.json();
        setDeals(data);
      } else {
        console.error('Failed to fetch deals:', response.status);
        if (retries > 0) {
          console.log(`Retrying fetch deals... (${retries} attempts left)`);
          setTimeout(() => fetchDeals(retries - 1), 1000);
        }
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
      if (retries > 0) {
        console.log(`Retrying fetch deals... (${retries} attempts left)`);
        setTimeout(() => fetchDeals(retries - 1), 1000);
      }
    }
  };

  const addDeal = async (deal: Omit<Deal, 'id'>) => {
    try {
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deal),
      });
      if (response.ok) {
        const newDeal = await response.json();
        setDeals((prevDeals) => [newDeal, ...prevDeals]);
      }
    } catch (error) {
      console.error('Error adding deal:', error);
    }
  };

  const bulkAddDeals = async (newDeals: Omit<Deal, 'id'>[]) => {
    try {
      // Check server health first
      try {
        const health = await fetch('/api/health');
        if (!health.ok) {
          const text = await health.text();
          console.error('Server health check failed:', health.status, text);
          return { success: false, error: `Server unreachable (Health: ${health.status}) | ${text.substring(0, 200)}` };
        }
      } catch (e) {
        console.error('Server health check error:', e);
        return { success: false, error: 'Server unreachable (Network error)' };
      }

      console.log(`Sending ${newDeals.length} deals to server...`);
      const response = await fetch('/api/import-deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDeals),
        cache: 'no-store'
      });
      
      if (response.ok) {
        await fetchDeals(); // Refresh list after bulk add
        return { success: true };
      }
      
      const text = await response.text();
      let errorMessage = `Server error: ${response.status}`;
      
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.details || errorData.error || errorMessage;
      } catch (e) {
        if (text) {
          errorMessage += ` | Response: ${text.substring(0, 300)}`;
        } else {
          errorMessage += ' | Empty response';
        }
      }
      return { success: false, error: errorMessage };
    } catch (error: any) {
      console.error('Error bulk adding deals:', error);
      return { success: false, error: error.message || 'Network error' };
    }
  };

  const updateDeal = async (id: number, updatedDeal: Partial<Deal>) => {
    try {
      const response = await fetch(`/api/deals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDeal),
      });
      if (response.ok) {
        setDeals((prevDeals) => prevDeals.map(deal => deal.id === id ? { ...deal, ...updatedDeal } : deal));
      }
    } catch (error) {
      console.error('Error updating deal:', error);
    }
  };

  const deleteDeal = async (id: number) => {
    try {
      console.log(`Deleting deal with ID: ${id}`);
      const response = await fetch(`/api/deals/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        console.log(`Successfully deleted deal ${id}`);
        setDeals((prevDeals) => prevDeals.filter(deal => deal.id !== id));
      } else {
        const errorText = await response.text();
        console.error(`Failed to delete deal ${id}:`, response.status, errorText);
        alert(`Failed to delete deal. Server returned: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting deal:', error);
      alert('Failed to delete deal due to network error.');
    }
  };

  return (
    <DealsContext.Provider value={{ deals, addDeal, bulkAddDeals, updateDeal, deleteDeal }}>
      {children}
    </DealsContext.Provider>
  );
}

export function useDeals() {
  const context = useContext(DealsContext);
  if (context === undefined) {
    throw new Error('useDeals must be used within a DealsProvider');
  }
  return context;
}
