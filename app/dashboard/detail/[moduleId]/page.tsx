/**
 * VISTA DE DETALLE DE MÓDULO: GET /dashboard/detail/[moduleId]
 * DESCRIPCIÓN: Visualización en profundidad de toda la telemetría recuperada con gráficos brutalistas nativos (HTML/CSS/SVG).
 * ESTÉTICA: Brutalista / Cyberpunk — Terminales con fósforo verde, contrastes en naranja y gráficos vectoriales planos.
 */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getDeliveryAnalytics,
  getBuyerAnalytics,
  getSellerAnalytics,
  getPaymentsAnalytics,
  SellerAnalyticsData,
  BuyerAnalyticsData,
  PaymentsAnalyticsData,
  DeliveryAnalyticsData
} from '@/lib/api';

export const dynamic = 'force-dynamic';

interface DetailPageProps {
  params: Promise<{
    moduleId: string;
  }>;
}

export default async function ModuleDetailPage({ params }: DetailPageProps) {
  const { moduleId } = await params;

  // Validar módulos disponibles
  const validModules = ['seller', 'buyer', 'payments', 'delivery'];
  if (!validModules.includes(moduleId)) {
    notFound();
  }

  // Carga paralela de todas las APIs
  const [deliveryData, buyerData, sellerData, paymentsData] = await Promise.all([
    getDeliveryAnalytics(),
    getBuyerAnalytics(),
    getSellerAnalytics(),
    getPaymentsAnalytics(),
  ]);

  // Fallbacks si las APIs están offline
  const isSellerOnline = !!sellerData;
  const isBuyerOnline = !!buyerData;
  const isPaymentsOnline = !!paymentsData;
  const isDeliveryOnline = !!deliveryData;

  // ──── DATA CONSOLIDATION & FALLBACKS ────

  // 1. Seller Fallbacks
  const activeSellerData: SellerAnalyticsData = sellerData || {
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

  // 2. Buyer Fallbacks
  const activeBuyerData: BuyerAnalyticsData = buyerData || {
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

  // 3. Payments Fallbacks
  const activePaymentsData: PaymentsAnalyticsData = paymentsData || {
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

  // 4. Delivery Fallbacks
  const activeDeliveryData: DeliveryAnalyticsData = deliveryData || {
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

  // Configuración estética según módulo
  const moduleConfig = {
    seller: {
      title: 'Módulo Vendedor // Seller Telemetry',
      themeColor: 'text-brand-neon border-brand-neon',
      accentBg: 'bg-brand-neon/10',
      fillColor: 'bg-brand-neon',
      isOnline: isSellerOnline,
    },
    buyer: {
      title: 'Módulo Comprador // Buyer Telemetry',
      themeColor: 'text-cyan-400 border-cyan-400',
      accentBg: 'bg-cyan-950/20',
      fillColor: 'bg-cyan-400',
      isOnline: isBuyerOnline,
    },
    payments: {
      title: 'Módulo de Pagos // Payments Telemetry',
      themeColor: 'text-brand-safety border-brand-safety',
      accentBg: 'bg-brand-safety/10',
      fillColor: 'bg-brand-safety',
      isOnline: isPaymentsOnline,
    },
    delivery: {
      title: 'Módulo de Drones // Delivery Telemetry',
      themeColor: 'text-emerald-400 border-emerald-400',
      accentBg: 'bg-emerald-950/20',
      fillColor: 'bg-emerald-400',
      isOnline: isDeliveryOnline,
    }
  }[moduleId as 'seller' | 'buyer' | 'payments' | 'delivery'];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black text-white font-mono">
      
      {/* ── Background Grid ── */}
      <div 
        className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none" 
        suppressHydrationWarning
        style={{ 
          backgroundImage: 'linear-gradient(0deg, transparent 24%, #ffffff 25%, #ffffff 26%, transparent 27%, transparent 74%, #ffffff 75%, #ffffff 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #ffffff 25%, #ffffff 26%, transparent 27%, transparent 74%, #ffffff 75%, #ffffff 76%, transparent 77%, transparent)', 
          backgroundSize: '40px 40px' 
        }}
      />

      {/* ── Scanline Effect ── */}
      <div 
        className="absolute top-0 left-0 w-full h-[2px] bg-brand-neon/10 pointer-events-none animate-scanline z-50"
      />

      {/* ── Header ── */}
      <header className="relative z-10 border-b-2 border-white/20 bg-black/80 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between px-6 py-4 gap-4">
          <div className="flex items-center gap-4">
            <span className={`font-bold tracking-[0.2em] uppercase ${moduleConfig.themeColor}`}>
              ◆ {moduleId.toUpperCase()} {"// DETAIL"}
            </span>
            <span className="text-white/20">/</span>
            <span className="text-white font-sans text-xl uppercase tracking-tighter">
              {moduleConfig.title}
            </span>
          </div>

          <div className="flex items-center gap-6 justify-between sm:justify-end">
            <div className="flex items-center gap-3">
              <span className={`text-[9px] font-bold tracking-wider px-2 py-0.5 border ${moduleConfig.themeColor}`}>
                {moduleConfig.isOnline ? 'ONLINE' : 'OFFLINE (FALLBACK)'}
              </span>
              <div className={`w-2.5 h-2.5 rounded-full ${moduleConfig.isOnline ? 'bg-brand-neon' : 'bg-brand-safety'} animate-pulse`} />
            </div>
            <Link href="/dashboard" className="border-2 border-white text-white hover:bg-white hover:text-black font-mono font-bold uppercase px-4 py-2 text-xs tracking-wider transition-colors duration-100">
              {"<// VOLVER AL PANEL"}
            </Link>
          </div>
        </div>
      </header>

      {/* ── main content panel ── */}
      <main className="flex-1 p-6 md:p-8 lg:p-12 relative z-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          
          {/* Alerta de fallback si está fuera de línea */}
          {!moduleConfig.isOnline && (
            <div className="border-2 border-brand-safety bg-brand-safety/5 p-4 flex items-center justify-between shadow-[4px_4px_0px_rgba(255,77,0,0.1)]">
              <div className="flex items-center gap-3">
                <span className="text-brand-safety text-lg font-bold">⚠️</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-safety">
                  CRITICAL_WARNING: La API del módulo se encuentra offline. Visualizando telemetría de respaldo simulada.
                </span>
              </div>
              <span className="text-[8px] text-white/30 font-mono">CODE: M2M_CONN_TIMEOUT</span>
            </div>
          )}

          {/* ──── SELLER DETAIL VIEW ──── */}
          {moduleId === 'seller' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Gráficos de Venta por Tienda */}
              <div className="lg:col-span-2 bg-zinc-950 border-2 border-white/10 p-6 flex flex-col justify-between shadow-[4px_4px_0px_rgba(255,255,255,0.02)]">
                <div>
                  <span className="text-[10px] text-brand-neon font-bold tracking-widest uppercase block mb-1">
                    {"GRÁFICO #01 // FACTURACIÓN POR MERCHANDISE"}
                  </span>
                  <h3 className="text-lg font-sans font-bold text-white uppercase mb-6">
                    Ingresos por Tienda Activa
                  </h3>
                  
                  {/* Brutalist Horizontal Bar Chart */}
                  <div className="flex flex-col gap-6">
                    {activeSellerData.top_selling_stores.map((store) => {
                      const maxRevenue = Math.max(...activeSellerData.top_selling_stores.map(s => s.total_revenue), 1);
                      const widthPercent = (store.total_revenue / maxRevenue) * 100;
                      return (
                        <div key={store.store_id} className="flex flex-col gap-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-white/80">{store.store_name}</span>
                            <span className="text-brand-neon font-bold">${store.total_revenue.toLocaleString('es-AR')} ARS ({store.total_orders} ord)</span>
                          </div>
                          <div className="w-full bg-zinc-900 border border-white/10 h-6 p-0.5">
                            <div 
                              style={{ width: `${widthPercent}%` }}
                              className="bg-brand-neon h-full transition-all duration-500 relative"
                            >
                              <div className="absolute right-2 top-0 text-[8px] text-black font-black leading-[18px]">
                                {widthPercent.toFixed(0)}%
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4 mt-6 text-[8px] text-white/30 font-mono">
                  TELEMETRÍA ACTUALIZADA HACE UNOS SEGUNDOS
                </div>
              </div>

              {/* Top Productos del Ecosistema */}
              <div className="bg-zinc-950 border-2 border-white/10 p-6 flex flex-col justify-between shadow-[4px_4px_0px_rgba(255,255,255,0.02)]">
                <div>
                  <span className="text-[10px] text-brand-neon font-bold tracking-widest uppercase block mb-1">
                    {"REPORTE #02 // VOLUMEN DE PRODUCTOS"}
                  </span>
                  <h3 className="text-lg font-sans font-bold text-white uppercase mb-6">
                    Productos Más Vendidos
                  </h3>

                  <div className="flex flex-col gap-4">
                    {activeSellerData.top_product_per_store.map((prod) => (
                      <div key={prod.product_id} className="border border-white/10 p-3 bg-black/40 flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-white truncate max-w-[70%]">{prod.product_name}</span>
                          <span className="text-[10px] text-brand-neon font-bold px-1.5 border border-brand-neon">{prod.total_quantity_sold} UDS</span>
                        </div>
                        <div className="flex justify-between text-[9px] text-white/40 font-mono mt-1">
                          <span>Store: {prod.store_name}</span>
                          <span>Revs: ${prod.total_product_revenue.toLocaleString('es-AR')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4 mt-6 text-[8px] text-white/30 font-mono">
                  FUENTES: SELLER ENDPOINTS M2M
                </div>
              </div>

            </div>
          )}

          {/* ──── BUYER DETAIL VIEW ──── */}
          {moduleId === 'buyer' && (
            <div className="flex flex-col gap-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Gráfico de Barras Verticales de Usuarios Activos */}
                <div className="bg-zinc-950 border-2 border-white/10 p-6 flex flex-col justify-between shadow-[4px_4px_0px_rgba(255,255,255,0.02)]">
                  <div>
                    <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase block mb-1">
                      {"GRÁFICO #01 // FLUJO DIARIO DE USUARIOS"}
                    </span>
                    <h3 className="text-lg font-sans font-bold text-white uppercase mb-6">
                      Usuarios Activos por Día
                    </h3>

                    {/* Brutalist Vertical Bar Chart */}
                    <div className="h-64 flex items-end justify-around border-b border-l border-white/20 pb-4 pl-4 gap-4 mt-8">
                      {activeBuyerData.active_users_per_day.map((day) => {
                        const maxUsers = Math.max(...activeBuyerData.active_users_per_day.map(u => u.active_users), 1);
                        const heightPercent = (day.active_users / maxUsers) * 100;
                        return (
                          <div key={day.date} className="flex flex-col items-center flex-1 h-full justify-end group">
                            <div className="text-[9px] text-cyan-400 font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {day.active_users}
                            </div>
                            <div 
                              style={{ height: `${heightPercent}%` }}
                              className="bg-cyan-400 w-full border border-black hover:bg-white transition-all duration-300 relative"
                            >
                              <div className="absolute inset-0 bg-white/20 mix-blend-overlay"></div>
                            </div>
                            <span className="text-[8px] text-white/40 mt-2 font-mono whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                              {day.date.split('-').slice(1).join('/')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-4 mt-6 text-[8px] text-white/30 font-mono">
                    MÉTRICA EN TIEMPO REAL / BUYER TELEMETRY
                  </div>
                </div>

                {/* Gráfico de Barras Verticales de Nuevos Usuarios */}
                <div className="bg-zinc-950 border-2 border-white/10 p-6 flex flex-col justify-between shadow-[4px_4px_0px_rgba(255,255,255,0.02)]">
                  <div>
                    <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase block mb-1">
                      {"GRÁFICO #02 // ADQUISICIÓN DIARIA"}
                    </span>
                    <h3 className="text-lg font-sans font-bold text-white uppercase mb-6">
                      Nuevos Usuarios por Día
                    </h3>

                    {/* Brutalist Vertical Bar Chart */}
                    <div className="h-64 flex items-end justify-around border-b border-l border-white/20 pb-4 pl-4 gap-4 mt-8">
                      {activeBuyerData.new_users_per_day.map((day) => {
                        const maxNew = Math.max(...activeBuyerData.new_users_per_day.map(u => u.new_users), 1);
                        const heightPercent = (day.new_users / maxNew) * 100;
                        return (
                          <div key={day.date} className="flex flex-col items-center flex-1 h-full justify-end group">
                            <div className="text-[9px] text-cyan-400 font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {day.new_users}
                            </div>
                            <div 
                              style={{ height: `${heightPercent}%` }}
                              className="bg-cyan-400/70 w-full border border-cyan-400 hover:bg-cyan-400 transition-all duration-300 relative"
                            >
                              <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
                            </div>
                            <span className="text-[8px] text-white/40 mt-2 font-mono whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                              {day.date.split('-').slice(1).join('/')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-4 mt-6 text-[8px] text-white/30 font-mono">
                    MÉTRICA DE ADQUISICIÓN / BUYER TELEMETRY
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Actividad por Hora */}
                <div className="bg-zinc-950 border-2 border-white/10 p-6 flex flex-col justify-between shadow-[4px_4px_0px_rgba(255,255,255,0.02)]">
                  <div>
                    <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase block mb-1">
                      {"GRÁFICO #03 // TRÁFICO HORARIO"}
                    </span>
                    <h3 className="text-lg font-sans font-bold text-white uppercase mb-6">
                      Actividad por Hora
                    </h3>

                    <div className="flex flex-col gap-4">
                      {activeBuyerData.activity_by_hour.map((activity, idx) => {
                        const maxActivity = Math.max(...activeBuyerData.activity_by_hour.map(a => a.activity_count), 1);
                        const widthPercent = (activity.activity_count / maxActivity) * 100;
                        return (
                          <div key={idx} className="flex flex-col gap-1">
                            <div className="flex justify-between text-[10px] font-mono">
                              <span className="text-white/80">{String(activity.hour).padStart(2, '0')}:00 HRS</span>
                              <span className="text-cyan-400 font-bold">{activity.activity_count} ACT</span>
                            </div>
                            <div className="w-full bg-zinc-900 border border-white/10 h-3 p-[1px]">
                              <div 
                                style={{ width: `${widthPercent}%` }}
                                className="bg-cyan-400 h-full opacity-80"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-4 mt-6 text-[8px] text-white/30 font-mono">
                    PATRÓN DE USO / BUYER DATABASE
                  </div>
                </div>

                {/* Clientes VIP (Gasto) */}
                <div className="bg-zinc-950 border-2 border-white/10 p-6 flex flex-col justify-between shadow-[4px_4px_0px_rgba(255,255,255,0.02)]">
                  <div>
                    <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase block mb-1">
                      {"AUDITORÍA #04 // TOP POR GASTO"}
                    </span>
                    <h3 className="text-lg font-sans font-bold text-white uppercase mb-6">
                      Clientes Destacados
                    </h3>

                    <div className="flex flex-col gap-4">
                      {activeBuyerData.top_buyers_by_amount.map((buyer, idx) => (
                        <div key={idx} className="border border-white/10 p-3 bg-black/40 flex flex-col">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-white">{buyer.name}</span>
                            <span className="text-xs font-bold text-cyan-400">${buyer.total_spent.toLocaleString('es-AR')}</span>
                          </div>
                          <span className="text-[9px] text-white/40">{buyer.email}</span>
                          <div className="flex justify-between text-[8px] text-white/30 font-mono border-t border-white/5 pt-1.5 mt-2">
                            <span>COMPRAS: {buyer.total_purchases}</span>
                            <span>STATUS: VIP</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-4 mt-6 text-[8px] text-white/30 font-mono">
                    ACTIVOS TOTALES: BUYER DATABASE
                  </div>
                </div>

                {/* Clientes VIP (Compras) */}
                <div className="bg-zinc-950 border-2 border-white/10 p-6 flex flex-col justify-between shadow-[4px_4px_0px_rgba(255,255,255,0.02)]">
                  <div>
                    <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase block mb-1">
                      {"AUDITORÍA #05 // TOP POR COMPRAS"}
                    </span>
                    <h3 className="text-lg font-sans font-bold text-white uppercase mb-6">
                      Compradores Frecuentes
                    </h3>

                    <div className="flex flex-col gap-4">
                      {activeBuyerData.top_buyers_by_purchases.map((buyer, idx) => (
                        <div key={idx} className="border border-white/10 p-3 bg-black/40 flex flex-col">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-white">{buyer.name}</span>
                            <span className="text-xs font-bold text-cyan-400">{buyer.total_purchases} ÓRDENES</span>
                          </div>
                          <span className="text-[9px] text-white/40">{buyer.email}</span>
                          <div className="flex justify-between text-[8px] text-white/30 font-mono border-t border-white/5 pt-1.5 mt-2">
                            <span>GASTO: ${buyer.total_spent.toLocaleString('es-AR')}</span>
                            <span>STATUS: RECURRENTE</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-4 mt-6 text-[8px] text-white/30 font-mono">
                    MÉTRICA DE FRECUENCIA: BUYER DATABASE
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ──── PAYMENTS DETAIL VIEW ──── */}
          {moduleId === 'payments' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Resumen Financiero y Métricas */}
              <div className="lg:col-span-2 bg-zinc-950 border-2 border-white/10 p-6 flex flex-col justify-between shadow-[4px_4px_0px_rgba(255,255,255,0.02)]">
                <div>
                  <span className="text-[10px] text-brand-safety font-bold tracking-widest uppercase block mb-1">
                    {"MÉTRICA #01 // FLUJO TRANSACCIONAL"}
                  </span>
                  <h3 className="text-lg font-sans font-bold text-white uppercase mb-6">
                    Métricas Consolidadas de Caja
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="border-l-4 border-brand-safety bg-black/40 p-4">
                      <span className="text-[8px] text-white/30 block mb-1">INGRESOS DE RED CONFIRMADOS</span>
                      <span className="text-2xl font-sans font-black text-white">${activePaymentsData.total_revenue.toLocaleString('es-AR')}</span>
                    </div>
                    <div className="border-l-4 border-yellow-500 bg-black/40 p-4">
                      <span className="text-[8px] text-white/30 block mb-1">FONDOS RETENIDOS EN ESCROW</span>
                      <span className="text-2xl font-sans font-black text-yellow-500">${activePaymentsData.total_escrow.toLocaleString('es-AR')}</span>
                    </div>
                    <div className="border-l-4 border-blue-500 bg-black/40 p-4">
                      <span className="text-[8px] text-white/30 block mb-1">COSTO TOTAL DE DELIVERY</span>
                      <span className="text-2xl font-sans font-black text-blue-500">${(activePaymentsData.total_delivery_cost || 0).toLocaleString('es-AR')}</span>
                    </div>
                    <div className="border-l-4 border-purple-500 bg-black/40 p-4">
                      <span className="text-[8px] text-white/30 block mb-1">TRANSACCIONES REGISTRADAS</span>
                      <span className="text-2xl font-sans font-black text-purple-500">{activePaymentsData.total_transactions} OP</span>
                    </div>
                  </div>

                  {/* Transaction Status Bar Chart */}
                  <span className="text-[10px] text-white/40 font-bold block mb-3 uppercase">Distribución de Estados en Transacciones</span>
                  <div className="flex flex-col gap-3">
                    {Object.entries(activePaymentsData.status_counts).map(([status, count]) => {
                      const maxCount = Math.max(...Object.values(activePaymentsData.status_counts), 1);
                      const widthPercent = (count / maxCount) * 100;
                      return (
                        <div key={status} className="flex items-center gap-4">
                          <span className="text-[10px] w-28 uppercase text-white/70 font-mono truncate">{status.replace('_', ' ')}</span>
                          <div className="flex-1 bg-zinc-900 border border-white/10 h-4 p-0.5">
                            <div 
                              style={{ width: `${widthPercent}%` }}
                              className="bg-brand-safety h-full"
                            />
                          </div>
                          <span className="text-[10px] font-bold text-brand-safety w-10 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4 mt-6 text-[8px] text-white/30 font-mono">
                  {"LEDGER INTEGRITY VERIFIED // SAFE PAYMENTS APP"}
                </div>
              </div>

              {/* Transacciones Recientes */}
              <div className="bg-zinc-950 border-2 border-white/10 p-6 flex flex-col justify-between shadow-[4px_4px_0px_rgba(255,255,255,0.02)]">
                <div>
                  <span className="text-[10px] text-brand-safety font-bold tracking-widest uppercase block mb-1">
                    {"LEDGER #02 // OPERACIONES RECIENTES"}
                  </span>
                  <h3 className="text-lg font-sans font-bold text-white uppercase mb-6">
                    Últimas Transacciones
                  </h3>

                  <div className="flex flex-col gap-3">
                    {activePaymentsData.recent_transactions.map((tx) => (
                      <div key={tx.order_id} className="border border-white/10 p-3 bg-black/40 flex flex-col font-mono">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-white">{tx.order_id}</span>
                          <span className="font-bold text-brand-safety">${tx.total_amount.toLocaleString('es-AR')}</span>
                        </div>
                        <div className="flex justify-between text-[8px] text-white/30 mt-2 uppercase">
                          <span>Estado: {tx.status}</span>
                          <span>{new Date(tx.created_at).toLocaleTimeString('es-AR')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4 mt-6 text-[8px] text-white/30 font-mono">
                  SUPABASE PAYMENTS TRANSACTION LOGS
                </div>
              </div>

            </div>
          )}

          {/* ──── DELIVERY DETAIL VIEW ──── */}
          {moduleId === 'delivery' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Tasa de Éxito Circular Gauge & Actividad de Drones */}
              <div className="bg-zinc-950 border-2 border-white/10 p-6 flex flex-col justify-between shadow-[4px_4px_0px_rgba(255,255,255,0.02)]">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase block mb-1 self-start">
                    {"MÉTRICA #01 // FLOTA DE DRONES"}
                  </span>
                  <h3 className="text-lg font-sans font-bold text-white uppercase mb-8 self-start">
                    Tasa de Éxito Logístico
                  </h3>

                  {/* Brutalist SVG Circular Gauge */}
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Fondo */}
                      <circle 
                        cx="50" cy="50" r="40" 
                        fill="transparent" 
                        stroke="#1c1917" 
                        strokeWidth="10" 
                      />
                      {/* Barra de progreso */}
                      <circle 
                        cx="50" cy="50" r="40" 
                        fill="transparent" 
                        stroke="#34d399" 
                        strokeWidth="10" 
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * activeDeliveryData.success_rate.rate)}
                        strokeLinecap="square"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-3xl font-sans font-black text-white">{(activeDeliveryData.success_rate.rate * 100).toFixed(1)}%</span>
                      <span className="text-[8px] text-white/40 uppercase tracking-widest">SUCCESS RATE</span>
                    </div>
                  </div>

                  {/* Datos Flotilla */}
                  <div className="grid grid-cols-2 gap-2 w-full mt-8">
                    <div className="border border-white/5 bg-black/40 p-2 flex flex-col items-center">
                      <span className="text-[8px] text-white/30 uppercase">Entregados</span>
                      <span className="text-sm font-bold text-emerald-400">{activeDeliveryData.success_rate.delivered}</span>
                    </div>
                    <div className="border border-white/5 bg-black/40 p-2 flex flex-col items-center">
                      <span className="text-[8px] text-white/30 uppercase">Cancelados</span>
                      <span className="text-sm font-bold text-brand-safety">{activeDeliveryData.success_rate.cancelled}</span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4 mt-6 text-[8px] text-white/30 font-mono">
                  DRONE MISSION RADAR TELEMETRY LOCK
                </div>
              </div>

              {/* Distribución de Drones y Zonas de Alta Demanda */}
              <div className="lg:col-span-2 bg-zinc-950 border-2 border-white/10 p-6 flex flex-col justify-between shadow-[4px_4px_0px_rgba(255,255,255,0.02)]">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase block mb-1">
                    {"ESTADO #02 // CAPACIDAD OPERATIVA"}
                  </span>
                  <h3 className="text-lg font-sans font-bold text-white uppercase mb-6">
                    Disponibilidad y Demanda
                  </h3>

                  {/* Split bar assigned vs available */}
                  <span className="text-[9px] text-white/40 font-bold block mb-2 uppercase">Flota: Asignados vs Disponibles</span>
                  <div className="w-full bg-zinc-900 border border-white/10 h-10 p-1 flex mb-8">
                    {/* Asignados (Volando) */}
                    <div 
                      style={{ flexGrow: activeDeliveryData.courier_activity_status.ASSIGNED }}
                      className="bg-brand-safety flex items-center justify-center text-[10px] font-black text-black transition-all duration-300"
                    >
                      {activeDeliveryData.courier_activity_status.ASSIGNED} VOLANDO
                    </div>
                    {/* Disponibles */}
                    <div 
                      style={{ flexGrow: activeDeliveryData.courier_activity_status.AVAILABLE }}
                      className="bg-emerald-400 flex items-center justify-center text-[10px] font-black text-black transition-all duration-300"
                    >
                      {activeDeliveryData.courier_activity_status.AVAILABLE} LISTOS
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Distancia Promedio */}
                    <div className="border border-white/10 p-4 bg-black/40 flex flex-col justify-between">
                      <div>
                        <span className="text-[8px] text-white/30 uppercase block mb-1">Distancia Recorrida Promedio</span>
                        <span className="text-xl font-bold text-white">{activeDeliveryData.delivery_distances.average_distance} uds telemétricas</span>
                      </div>
                      <p className="text-[9px] text-white/40 mt-3">
                        Calculado en base a misiones de entrega finalizadas dentro del rango operativo actual de drones.
                      </p>
                    </div>

                    {/* Zonas de Alta Demanda */}
                    <div className="border border-white/10 p-4 bg-black/40">
                      <span className="text-[8px] text-white/30 uppercase block mb-2">Zonas de Mayor Tránsito (Radar)</span>
                      <div className="flex flex-col gap-2">
                        {activeDeliveryData.high_demand_zones.map((zone, idx) => (
                          <div key={idx} className="flex gap-2 items-center text-[10px] font-mono border-b border-white/5 pb-1">
                            <span className="text-emerald-400">⚡</span>
                            <span className="truncate text-white/80">{zone.buyer_address}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4 mt-6 text-[8px] text-white/30 font-mono">
                  {"COURIER STATUS: OK // DATABASE STABLE"}
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/20 bg-black/90 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-[9px] text-white/30">
        <div>
          {"BuscaloYa Ecosistema Centralizado © 2026 // Detalle Telemétrico"}
        </div>
        <div className="flex gap-4">
          <span>SECURE_LINK: OK</span>
          <span>|</span>
          <span className="text-brand-neon">STATUS: ONLINE_SYNCED</span>
        </div>
      </footer>

    </div>
  );
}
