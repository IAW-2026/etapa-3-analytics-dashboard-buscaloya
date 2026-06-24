/**
 * PÁGINA DEL DASHBOARD: GET /dashboard
 * DESCRIPCIÓN: Panel de analíticas y reportes consolidados en tiempo real.
 * ESTÉTICA: Brutalista / Cyberpunk — Grillas asimétricas, terminales interactivos, barras de progreso y colores de alerta.
 */
import Link from 'next/link';
import {
  getDeliveryAnalytics,
  getBuyerAnalytics,
  getSellerAnalytics,
  getPaymentsAnalytics,
  ActivityHour,
  NewUsersDay,
  TopSellingStore,
  SellerAnalyticsData,
  BuyerAnalyticsData,
  PaymentsAnalyticsData,
  DeliveryAnalyticsData,
  DashboardModule
} from '@/lib/api';

export const dynamic = 'force-dynamic';

// ── MODULE BUILDERS (MODULAR FUNCTIONS) ──

function formatSellerModule(sellerData: SellerAnalyticsData | null): DashboardModule {
  const totalStores = sellerData?.top_selling_stores?.length || 0;
  const totalSellerOrders = sellerData?.top_selling_stores
    ? sellerData.top_selling_stores.reduce((acc: number, curr: TopSellingStore) => acc + curr.total_orders, 0)
    : 0;
  const topStoreName = sellerData?.top_selling_stores?.[0]
    ? `${sellerData.top_selling_stores[0].store_name.split(' ')[0]} ($${Math.round(sellerData.top_selling_stores[0].total_revenue)})`
    : 'N/A';

  return {
    id: 'seller',
    name: 'Seller Module',
    code: 'SELL_MOD_01',
    status: sellerData ? 'ONLINE' : 'OFFLINE (FALLBACK)',
    color: sellerData ? 'neon' : 'safety',
    apiEndpoint: process.env.SELLER_APP_URL 
      ? `${process.env.SELLER_APP_URL.endsWith('/') ? process.env.SELLER_APP_URL.slice(0, -1) : process.env.SELLER_APP_URL}/api/seller/analytics`
      : 'https://proyecto-b-seller-buscaloya.vercel.app/api/seller/analytics',
    metrics: sellerData ? [
      { label: 'TIENDAS CON VENTAS', value: `${totalStores}` },
      { label: 'PAQUETES VENDIDOS', value: `${totalSellerOrders}` },
      { label: 'TIENDA LÍDER', value: topStoreName },
    ] : [
      { label: 'TIENDAS REGISTRADAS', value: '14' },
      { label: 'PAQUETES DESPACHADOS', value: '312' },
      { label: 'STOCK CRÍTICO', value: '3 ITEMS', warning: true },
    ],
    logs: sellerData ? [
      `Tienda líder: ${sellerData.top_selling_stores[0]?.store_name || 'N/A'} ($${sellerData.top_selling_stores[0]?.total_revenue || 0})`,
      `Producto top: ${sellerData.top_product_per_store[0]?.product_name || 'N/A'} (${sellerData.top_product_per_store[0]?.total_quantity_sold || 0} uds)`,
      `Total tiendas en red: ${sellerData.top_selling_stores.length}`,
    ] : [
      'Fetching stores list... OK',
      'Validating dispatch webhooks... SECURE',
      'Package #a6152fe0 dispatch confirmed... OK',
    ],
    progress: sellerData ? 100 : 80,
  };
}

function formatBuyerModule(buyerData: BuyerAnalyticsData | null): DashboardModule {
  const lastActiveCount = (buyerData?.active_users_per_day && buyerData.active_users_per_day.length > 0)
    ? buyerData.active_users_per_day[buyerData.active_users_per_day.length - 1].active_users 
    : 0;
  const buyerNew30d = buyerData?.new_users_per_day
    ? buyerData.new_users_per_day.reduce((acc: number, curr: NewUsersDay) => acc + curr.new_users, 0)
    : 0;
  const topSpenderName = buyerData?.top_buyers_by_amount?.[0]
    ? `${buyerData.top_buyers_by_amount[0].name.split(' ')[0]} ($${Math.round(buyerData.top_buyers_by_amount[0].total_spent)})`
    : 'N/A';
  const topHour = buyerData?.activity_by_hour?.[0]
    ? `${buyerData.activity_by_hour[0].hour}:00hs`
    : 'N/A';

  return {
    id: 'buyer',
    name: 'Buyer Module',
    code: 'BUY_MOD_02',
    status: buyerData ? 'ONLINE' : 'OFFLINE (FALLBACK)',
    color: buyerData ? 'neon' : 'safety',
    apiEndpoint: process.env.BUYER_APP_URL 
      ? `${process.env.BUYER_APP_URL.endsWith('/') ? process.env.BUYER_APP_URL.slice(0, -1) : process.env.BUYER_APP_URL}/api/analytics`
      : 'https://proyecto-b-buyer-buscaloya.vercel.app/api/analytics',
    metrics: buyerData ? [
      { label: 'ACTIVOS (ÚLT. DÍA)', value: `${lastActiveCount}` },
      { label: 'NUEVOS (30 DÍAS)', value: `${buyerNew30d}` },
      { label: 'TOP COMPRADOR', value: topSpenderName },
    ] : [
      { label: 'CLIENTES CONECTADOS', value: '458' },
      { label: 'CARRITOS ACTIVOS', value: '32' },
      { label: 'VALORACIONES (CSAT)', value: '4.85 / 5.00' },
    ],
    logs: buyerData ? [
      `Hora pico tráfico: ${topHour} (${buyerData.activity_by_hour[0]?.activity_count || 0} eventos)`,
      `Top Compras: ${buyerData.top_buyers_by_purchases[0]?.name || 'N/A'} (${buyerData.top_buyers_by_purchases[0]?.total_purchases || 0} ord.)`,
      `Actividad total logs: ${buyerData.activity_by_hour.reduce((acc: number, curr: ActivityHour) => acc + curr.activity_count, 0)} reg.`,
    ] : [
      'Establishing client-side websocket links... OK',
      'Syncing buyer order tracker... ONLINE',
      'Telemetry feedback listener active... OK',
    ],
    progress: buyerData ? 100 : 95,
  };
}

function formatPaymentsModule(paymentsData: PaymentsAnalyticsData | null): DashboardModule {
  const totalRevenue = paymentsData?.total_revenue || 0;
  const totalEscrow = paymentsData?.total_escrow || 0;
  const totalTransactions = paymentsData?.total_transactions || 0;

  return {
    id: 'payments',
    name: 'Payments Module',
    code: 'PAY_MOD_03',
    status: paymentsData ? 'ONLINE' : 'OFFLINE (FALLBACK)',
    color: paymentsData ? 'neon' : 'safety',
    apiEndpoint: process.env.PAYMENTS_APP_URL 
      ? `${process.env.PAYMENTS_APP_URL.endsWith('/') ? process.env.PAYMENTS_APP_URL.slice(0, -1) : process.env.PAYMENTS_APP_URL}/api/analytics`
      : 'https://proyecto-b-payments-buscaloya.vercel.app/api/analytics',
    metrics: paymentsData ? [
      { label: 'TRANSACCIONES PROCESADAS', value: `${totalTransactions}` },
      { label: 'INGRESOS CONFIRMADOS', value: `$${totalRevenue.toLocaleString('es-AR')} ARS` },
      { label: 'FONDOS EN ESCROW', value: `$${totalEscrow.toLocaleString('es-AR')} ARS`, warning: totalEscrow > 100000 },
    ] : [
      { label: 'TRANSACCIONES PROCESADAS', value: '1,429' },
      { label: 'FONDOS EN ESCROW', value: '$840,500 ARS' },
      { label: 'DISPUTAS ACTIVAS', value: '0', warning: false },
    ],
    logs: paymentsData ? [
      `Último pago: $${paymentsData.recent_transactions[0]?.total_amount || 0} (${paymentsData.recent_transactions[0]?.status || 'N/A'})`,
      `Transacciones fallidas: ${paymentsData.status_counts.failed || 0} operaciones`,
      `Cuentas cerradas / completadas: ${paymentsData.status_counts.closed || 0}`,
    ] : [
      'Escrow verification sequence loaded... OK',
      'Checking pending releases... SYNCED',
      'Payments ledger integrity validation... SECURE',
    ],
    progress: paymentsData ? 100 : 65,
  };
}

function formatDeliveryModule(deliveryData: DeliveryAnalyticsData | null): DashboardModule {
  return {
    id: 'delivery',
    name: 'Delivery Module',
    code: 'DEL_MOD_04',
    status: deliveryData ? 'ONLINE' : 'OFFLINE (FALLBACK)',
    color: deliveryData ? 'neon' : 'safety',
    apiEndpoint: process.env.DELIVERY_APP_URL 
      ? `${process.env.DELIVERY_APP_URL.endsWith('/') ? process.env.DELIVERY_APP_URL.slice(0, -1) : process.env.DELIVERY_APP_URL}/api/analytics`
      : 'https://proyecto-b-delivery-buscaloya.vercel.app/api/analytics',
    metrics: deliveryData ? [
      { label: 'TASA DE ÉXITO', value: `${(deliveryData.success_rate.rate * 100).toFixed(1)}%` },
      { label: 'ACTIVAS / TOTAL', value: `${deliveryData.success_rate.active} / ${deliveryData.success_rate.total}` },
      { label: 'DISTANCIA PROM.', value: `${deliveryData.delivery_distances.average_distance} uds` },
    ] : [
      { label: 'DRONES EN FLOTA (ADMIN)', value: '6 UNIDADES' },
      { label: 'MISIONES ACTIVAS (RADAR)', value: '2 VUELOS' },
      { label: 'PROMEDIO BATERÍA', value: '87%' },
    ],
    logs: deliveryData ? [
      `Envíos: ${deliveryData.success_rate.delivered} completados | ${deliveryData.success_rate.cancelled} cancelados`,
      `Flota: ${deliveryData.courier_activity_status.ASSIGNED} volando | ${deliveryData.courier_activity_status.AVAILABLE} disponibles`,
      `Alta demanda: ${deliveryData.high_demand_zones[0]?.buyer_address ? deliveryData.high_demand_zones[0].buyer_address.slice(0, 20) + '...' : 'NINGUNA'}`,
    ] : [
      'Connecting to Supabase Realtime channel... OK',
      'Drone #3 telemetry sync lock acquired... OK',
      'Mission status CANCELLED_SUCCESSFULLY mapped... OK',
    ],
    progress: deliveryData ? Math.round(deliveryData.success_rate.rate * 100) : 87,
  };
}

// ── MAIN COMPONENT ──

export default async function Dashboard() {
  // Paralelización de peticiones para rendimiento y latencia ultrabaja
  const [deliveryData, buyerData, sellerData, paymentsData] = await Promise.all([
    getDeliveryAnalytics(),
    getBuyerAnalytics(),
    getSellerAnalytics(),
    getPaymentsAnalytics(),
  ]);

  const modules = [
    formatSellerModule(sellerData),
    formatBuyerModule(buyerData),
    formatPaymentsModule(paymentsData),
    formatDeliveryModule(deliveryData),
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black text-white font-mono">
      
      {/* ── Background Grid: Cuadrícula Industrial ── */}
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

      {/* ── Header: Divisor Brutalista + Controles de Retorno ── */}
      <header className="relative z-10 border-b-2 border-white/20 bg-black/80 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between px-6 py-4 gap-4">
          <div className="flex items-center gap-4">
            <span className="text-brand-neon text-lg font-bold tracking-[0.2em] uppercase">
              ◆ ANALYTICS
            </span>
            <span className="text-white/20">/</span>
            <span className="text-white font-sans text-xl uppercase tracking-tighter">
              Dashboard_Central
            </span>
          </div>

          <div className="flex items-center gap-6 justify-between sm:justify-end">
            <div className="flex items-center gap-3">
              <span className="brutalist-tag animate-pulse-neon">CONTROL // MONITOR</span>
              <div className="w-2.5 h-2.5 bg-brand-neon animate-pulse-neon" />
            </div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard/inference" className="border-2 border-brand-neon text-brand-neon hover:bg-brand-neon hover:text-black font-mono font-bold uppercase px-4 py-2 text-xs tracking-wider transition-all duration-100">
                ⚡ Cruzar Datos
              </Link>
              <Link href="/" className="border-2 border-white text-white hover:bg-white hover:text-black font-mono font-bold uppercase px-4 py-2 text-xs tracking-wider transition-colors duration-100">
                &lt;// RETORNAR
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Panel Grid ── */}
      <main className="flex-1 p-6 md:p-8 lg:p-12 relative z-10 overflow-y-auto">
        
        {/* 4 Cuadrículas Brutalistas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {modules.map((mod) => {
            const isNeon = mod.color === 'neon';
            const accentClass = isNeon ? 'text-brand-neon border-brand-neon' : 'text-brand-safety border-brand-safety';
            const bgHover = isNeon ? 'hover:shadow-[8px_8px_0px_rgba(0,255,0,0.15)]' : 'hover:shadow-[8px_8px_0px_rgba(255,77,0,0.15)]';
            
            return (
              <div 
                key={mod.id} 
                className={`bg-zinc-950 border-2 border-white/10 hover:border-current transition-all duration-150 flex flex-col justify-between min-h-[360px] p-6 shadow-[6px_6px_0px_rgba(255,255,255,0.03)] ${accentClass} ${bgHover}`}
              >
                
                {/* Cabecera del Módulo */}
                <div className="border-b border-white/10 pb-4 mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-white/40 font-mono tracking-widest">
                      {mod.code}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold tracking-wider px-2 py-0.5 border ${accentClass}`}>
                        {mod.status}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${isNeon ? 'bg-brand-neon' : 'bg-brand-safety'} animate-pulse`} />
                    </div>
                  </div>
                  <h4 className="text-2xl font-sans text-white uppercase tracking-tighter font-black">
                    {mod.name}
                  </h4>
                </div>

                {/* Métricas */}
                <div className="flex-1 flex flex-col justify-center gap-4 py-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {mod.metrics.map((metric, idx) => (
                      <div key={idx} className="border border-white/5 bg-black/40 p-3 flex flex-col gap-1">
                        <span className="text-[8px] text-white/30 tracking-wider uppercase font-bold leading-tight">
                          {metric.label}
                        </span>
                        <span className={`text-base font-bold tracking-tighter ${metric.warning ? 'text-brand-safety' : 'text-white'}`}>
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Terminal logs de simulación */}
                <div className="bg-black/60 border border-white/5 p-3 my-4 font-mono text-[9px] text-white/50 flex flex-col gap-1">
                  <span className="text-white/30 font-bold block mb-1">CONSOLE_OUTPUT //</span>
                  {mod.logs.map((log, idx) => (
                    <div key={idx} className="truncate">
                      <span className={isNeon ? 'text-brand-neon' : 'text-brand-safety'}>&gt;</span> {log}
                    </div>
                  ))}
                </div>

                {/* Footer del Módulo */}
                <div className="border-t border-white/10 pt-4 flex justify-between items-center text-[8px] text-white/30 tracking-widest font-mono">
                  <span>API_LINK:</span>
                  <span className="hover:text-white transition-colors duration-75 uppercase truncate max-w-[70%] text-right font-bold">
                    {mod.apiEndpoint}
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/20 bg-black/90 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-[9px] text-white/30">
        <div>
          BuscaloYa Ecosistema Centralizado © 2026 // Panel Consolidado
        </div>
        <div className="flex gap-4">
          <span>SECURE_LINK: OK</span>
          <span>|</span>
          <span className="text-brand-neon">STATUS: STABLE_RUN</span>
        </div>
      </footer>

    </div>
  );
}
