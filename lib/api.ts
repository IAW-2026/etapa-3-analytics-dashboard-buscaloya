export interface ActiveUsersDay {
  date: string;
  active_users: number;
}

export interface ActivityHour {
  hour: number;
  activity_count: number;
}

export interface NewUsersDay {
  date: string;
  new_users: number;
}

export interface TopBuyer {
  name: string;
  email: string;
  total_purchases: number;
  total_spent: number;
}

export interface TopSellingStore {
  store_id: string;
  store_name: string;
  total_orders: number;
  total_revenue: number;
}

export interface TopProductPerStore {
  store_name: string;
  store_id: string;
  product_id: string;
  product_name: string;
  total_quantity_sold: number;
  total_product_revenue: number;
}

export interface SellerAnalyticsData {
  module: string;
  top_selling_stores: TopSellingStore[];
  top_product_per_store: TopProductPerStore[];
}

export interface BuyerAnalyticsData {
  active_users_per_day: ActiveUsersDay[];
  activity_by_hour: ActivityHour[];
  new_users_per_day: NewUsersDay[];
  top_buyers_by_purchases: TopBuyer[];
  top_buyers_by_amount: TopBuyer[];
}

export interface RecentPaymentTransaction {
  order_id: string;
  status: string;
  total_amount: number;
  created_at: string;
}

export interface PaymentsAnalyticsData {
  module: string;
  total_revenue: number;
  total_escrow: number;
  total_transactions: number;
  status_counts: Record<string, number>;
  status_amounts: Record<string, number>;
  recent_transactions: RecentPaymentTransaction[];
}

export interface DeliveryAnalyticsData {
  success_rate: {
    rate: number;
    active: number;
    total: number;
    delivered: number;
    cancelled: number;
  };
  delivery_distances: {
    average_distance: number;
  };
  courier_activity_status: {
    ASSIGNED: number;
    AVAILABLE: number;
  };
  high_demand_zones: {
    buyer_address: string;
  }[];
}

export interface DashboardModule {
  id: string;
  name: string;
  code: string;
  status: string;
  color: string;
  apiEndpoint: string;
  metrics: {
    label: string;
    value: string;
    warning?: boolean;
  }[];
  logs: string[];
  progress: number;
}

export async function getDeliveryAnalytics(): Promise<DeliveryAnalyticsData | null> {
  const baseUrl = process.env.DELIVERY_APP_URL || 'https://proyecto-b-delivery-buscaloya.vercel.app';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const url = `${cleanBase}/api/analytics`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching delivery analytics:', error);
    return null;
  }
}

export async function getBuyerAnalytics(): Promise<BuyerAnalyticsData | null> {
  const baseUrl = process.env.BUYER_APP_URL || 'https://proyecto-b-buyer-buscaloya.vercel.app';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const url = `${cleanBase}/api/analytics`;
  const token = process.env.BUYER_SERVICE_SECRET;
  try {
    const res = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${token || ''}`
      }
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching buyer analytics:', error);
    return null;
  }
}

export async function getSellerAnalytics(): Promise<SellerAnalyticsData | null> {
  const baseUrl = process.env.SELLER_APP_URL || 'https://proyecto-b-seller-buscaloya.vercel.app';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const url = `${cleanBase}/api/seller/analytics`;
  const token = process.env.SELLER_API_KEY || process.env.SELLER_SERVICE_SECRET;
  try {
    const res = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${token || ''}`
      }
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching seller analytics:', error);
    return null;
  }
}

export async function getPaymentsAnalytics(): Promise<PaymentsAnalyticsData | null> {
  const baseUrl = process.env.PAYMENTS_APP_URL || 'https://proyecto-b-payments-buscaloya.vercel.app';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const url = `${cleanBase}/api/analytics`;
  const token = process.env.PAYMENTS_SERVICE_SECRET;
  try {
    const res = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${token || ''}`
      }
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching payments analytics:', error);
    return null;
  }
}
