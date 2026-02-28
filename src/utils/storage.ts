import * as XLSX from 'xlsx';

const STORAGE_KEY = 'newsletter_emails';

interface Subscriber {
  email: string;
  timestamp: string;
}

const getSubscribers = (): Subscriber[] => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(stored)) return [];
    
    // Handle migration from string[] to Subscriber[]
    return stored.map((item: string | Subscriber) => {
      if (typeof item === 'string') {
        return { email: item, timestamp: new Date().toISOString() }; // Use current time for old entries as fallback
      }
      return item;
    });
  } catch (error) {
    console.error('Error retrieving subscribers:', error);
    return [];
  }
};

export const saveEmail = (email: string): boolean => {
  if (!email) return false;
  
  try {
    const subscribers = getSubscribers();
    
    // Check for duplicates
    if (subscribers.some(sub => sub.email === email)) {
      return false;
    }
    
    subscribers.push({
      email,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscribers));
    return true;
  } catch (error) {
    console.error('Error saving email:', error);
    return false;
  }
};

export const downloadEmailsAsExcel = () => {
  const subscribers = getSubscribers();
  if (subscribers.length === 0) {
    alert('No emails to export.');
    return;
  }

  // Create worksheet data
  const data = subscribers.map(sub => {
    const date = new Date(sub.timestamp);
    return {
      Email: sub.email,
      Date: date.toLocaleDateString(),
      Time: date.toLocaleTimeString()
    };
  });
  
  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Customers");
  
  // Generate Excel file and trigger download
  XLSX.writeFile(wb, "Customer_Data.xlsx");
};

export const downloadDealsAsExcel = (deals: any[]) => {
  if (deals.length === 0) {
    alert('No deals to export.');
    return;
  }

  // Create worksheet data
  const data = deals.map(deal => ({
    Title: deal.title,
    Brand: deal.brand,
    OriginalPrice: deal.originalPrice,
    DealPrice: deal.dealPrice,
    Discount: deal.discount,
    Rating: deal.rating,
    Reviews: deal.reviews,
    Image: deal.image,
    ExpiresIn: deal.expiresIn,
    Category: deal.category,
    OfferUrl: deal.offerUrl
  }));
  
  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Deals");
  
  // Generate Excel file and trigger download
  XLSX.writeFile(wb, "Deals_Import.xlsx");
};
