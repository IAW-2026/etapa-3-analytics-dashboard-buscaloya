import {
  SellerAnalyticsData,
  BuyerAnalyticsData,
  PaymentsAnalyticsData,
  DeliveryAnalyticsData
} from '@/lib/api';

export const fallbackSellerData: SellerAnalyticsData = {
  module: "seller",
  top_selling_stores: [
    { store_id: 's1', store_name: 'Cyberpunk Groceries', total_orders: 142, total_revenue: 450200 },
    { store_id: 's2', store_name: 'Neon Ramen Bar', total_orders: 98, total_revenue: 320500 },
    { store_id: 's3', store_name: 'Synthwave Coffee', total_orders: 87, total_revenue: 120800 },
    { store_id: 's4', store_name: 'Grid Hardware Store', total_orders: 45, total_revenue: 95400 }
  ],
  top_product_per_store: [
    { store_name: 'Cyberpunk Groceries', store_id: 's1', product_id: 'p1', product_name: 'Nuka Cola Classic', total_quantity_sold: 250, total_product_revenue: 125000 },
    { store_name: 'Neon Ramen Bar', store_id: 's2', product_id: 'p2', product_name: 'Spicy Shoyu Ramen', total_quantity_sold: 180, total_product_revenue: 270000 },
    { store_name: 'Synthwave Coffee', store_id: 's3', product_id: 'p3', product_name: 'Overclocked Espresso', total_quantity_sold: 210, total_product_revenue: 105000 },
    { store_name: 'Grid Hardware Store', store_id: 's4', product_id: 'p4', product_name: 'Quantum LED Strips', total_quantity_sold: 110, total_product_revenue: 77000 }
  ]
};

export const fallbackBuyerData: BuyerAnalyticsData = {
  active_users_per_day: [
    { date: '2026-06-20', active_users: 120 },
    { date: '2026-06-21', active_users: 145 },
    { date: '2026-06-22', active_users: 210 },
    { date: '2026-06-23', active_users: 195 },
    { date: '2026-06-24', active_users: 280 }
  ],
  activity_by_hour: [
    { hour: 0, activity_count: 45 },
    { hour: 4, activity_count: 12 },
    { hour: 8, activity_count: 98 },
    { hour: 12, activity_count: 154 },
    { hour: 16, activity_count: 120 },
    { hour: 20, activity_count: 210 }
  ],
  new_users_per_day: [
    { date: '2026-06-20', new_users: 12 },
    { date: '2026-06-21', new_users: 24 },
    { date: '2026-06-22', new_users: 38 },
    { date: '2026-06-23', new_users: 19 },
    { date: '2026-06-24', new_users: 48 }
  ],
  top_buyers_by_purchases: [
    { name: 'Hiro Protagonist', email: 'hiro@metaverse.net', total_purchases: 18, total_spent: 85200 },
    { name: 'Case Gibson', email: 'case@chiba.sky', total_purchases: 14, total_spent: 64100 },
    { name: 'Molly Millions', email: 'molly@razorgirl.org', total_purchases: 12, total_spent: 98700 }
  ],
  top_buyers_by_amount: [
    { name: 'Molly Millions', email: 'molly@razorgirl.org', total_purchases: 12, total_spent: 98700 },
    { name: 'Hiro Protagonist', email: 'hiro@metaverse.net', total_purchases: 18, total_spent: 85200 },
    { name: 'Case Gibson', email: 'case@chiba.sky', total_purchases: 14, total_spent: 64100 }
  ]
};

export const fallbackPaymentsData: PaymentsAnalyticsData = {
  module: "payments",
  total_revenue: 894500,
  total_escrow: 120400,
  total_delivery_cost: 75200,
  total_transactions: 145,
  status_counts: {
    paid: 110,
    payment_pending: 18,
    failed: 7,
    cancelled: 10,
    closed: 12
  },
  status_amounts: {
    paid: 680000,
    payment_pending: 94000,
    failed: 12000,
    cancelled: 45000,
    closed: 63500
  },
  recent_transactions: [
    { order_id: 'tx_a8f9', status: 'paid', total_amount: 12500, created_at: '2026-06-24T15:20:00Z' },
    { order_id: 'tx_b4c2', status: 'payment_pending', total_amount: 4300, created_at: '2026-06-24T15:15:00Z' },
    { order_id: 'tx_7e1a', status: 'closed', total_amount: 18900, created_at: '2026-06-24T15:02:00Z' },
    { order_id: 'tx_9d5d', status: 'failed', total_amount: 8700, created_at: '2026-06-24T14:48:00Z' },
    { order_id: 'tx_f0a1', status: 'cancelled', total_amount: 6200, created_at: '2026-06-24T14:30:00Z' }
  ]
};

export const fallbackDeliveryData: DeliveryAnalyticsData = {
  success_rate: {
    rate: 0.933,
    active: 3,
    total: 45,
    delivered: 42,
    cancelled: 3
  },
  delivery_distances: {
    average_distance: 6.8
  },
  courier_activity_status: {
    ASSIGNED: 3,
    AVAILABLE: 7
  },
  high_demand_zones: [
    { buyer_address: 'Av. Corrientes 1240, CABA' },
    { buyer_address: 'Av. Cabildo 2230, CABA' },
    { buyer_address: 'Calle Florida 550, CABA' }
  ]
};
