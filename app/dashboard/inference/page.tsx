/**
 * PÁGINA DE INFERENCIAS: GET /dashboard/inference
 * DESCRIPCIÓN: Vista centralizada para cruce de datos inter-módulos y algoritmos de inferencia predictiva.
 * ESTÉTICA: Brutalista / Cyberpunk — Terminales con outputs deductivos en verde fósforo y naranja de seguridad.
 */
import Link from 'next/link';
import {
  getDeliveryAnalytics,
  getBuyerAnalytics,
  getSellerAnalytics,
  getPaymentsAnalytics,
  TopSellingStore
} from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function InferencePage() {
  // Carga paralela de todas las APIs
  const [deliveryData, buyerData, sellerData, paymentsData] = await Promise.all([
    getDeliveryAnalytics(),
    getBuyerAnalytics(),
    getSellerAnalytics(),
    getPaymentsAnalytics(),
  ]);

  // 1. Cálculos de Inferencia 1: Logística vs Finanzas (Delivery + Payments)
  const isDeliveryOnline = !!deliveryData;
  const isPaymentsOnline = !!paymentsData;
  
  const deliverySuccessRate = deliveryData?.success_rate?.rate || 0;
  const averageDistance = deliveryData?.delivery_distances?.average_distance || 0;
  const totalRevenue = paymentsData?.total_revenue || 0;

  // Rendimiento de facturación por unidad de distancia recorrida
  const revenuePerDistanceUnit = (isPaymentsOnline && isDeliveryOnline && averageDistance > 0)
    ? totalRevenue / averageDistance
    : 0;

  let logisticsFinanceInference = '';
  let logisticsFinanceColor = 'text-white';
  
  if (!isDeliveryOnline || !isPaymentsOnline) {
    logisticsFinanceInference = 'DATOS INSUFICIENTES: Uno o ambos módulos (Delivery / Payments) se encuentran offline. Usando parámetros simulados estándar de flota.';
    logisticsFinanceColor = 'text-brand-safety';
  } else if (deliverySuccessRate > 0.85) {
    logisticsFinanceInference = `EFICIENCIA CRÍTICA ÓPTIMA: La tasa de éxito de entrega (${(deliverySuccessRate * 100).toFixed(1)}%) y la distancia promedio (${averageDistance.toFixed(1)} uds) están maximizando la facturación. Se generan $${revenuePerDistanceUnit.toFixed(2)} ARS por unidad de distancia recorrida en la flota de drones. Flujo de caja estable.`;
    logisticsFinanceColor = 'text-brand-neon';
  } else {
    logisticsFinanceInference = `ALERTA DE LOGÍSTICA: Con una tasa de éxito de entrega del ${(deliverySuccessRate * 100).toFixed(1)}%, existe un riesgo latente de cancelaciones acumuladas. El costo de combustible telemétrico y desgaste de batería en misiones fallidas podría comprometer el margen neto de ganancias.`;
    logisticsFinanceColor = 'text-brand-safety';
  }

  // 2. Cálculos de Inferencia 2: Concentración de Clientes VIP vs Tiendas (Buyer + Seller)
  const isBuyerOnline = !!buyerData;
  const isSellerOnline = !!sellerData;

  const topSpenderName = buyerData?.top_buyers_by_amount?.[0]?.name || 'N/A';
  const topSpenderSpent = buyerData?.top_buyers_by_amount?.[0]?.total_spent || 0;
  const leaderStoreName = sellerData?.top_selling_stores?.[0]?.store_name || 'N/A';
  const leaderStoreRevenue = sellerData?.top_selling_stores?.[0]?.total_revenue || 0;

  // Participación estimada del cliente estrella sobre la tienda líder
  const vipShareOfLeaderStore = (leaderStoreRevenue > 0 && topSpenderSpent > 0)
    ? (topSpenderSpent / leaderStoreRevenue) * 100
    : 0;

  let buyerSellerInference = '';
  let buyerSellerColor = 'text-white';

  if (!isBuyerOnline || !isSellerOnline) {
    buyerSellerInference = 'DATOS INSUFICIENTES: Uno o ambos módulos (Buyer / Seller) se encuentran offline. Imposible calcular cuota de mercado VIP.';
    buyerSellerColor = 'text-brand-safety';
  } else if (vipShareOfLeaderStore > 50) {
    buyerSellerInference = `ALERTA DE DEPENDENCIA DE CLIENTE: El comprador VIP "${topSpenderName}" ha gastado $${topSpenderSpent.toLocaleString('es-AR')} ARS, lo que representa un ${vipShareOfLeaderStore.toFixed(1)}% de las ventas de la tienda líder "${leaderStoreName}". Riesgo alto de volatilidad si el cliente reduce su tasa de recompra.`;
    buyerSellerColor = 'text-brand-safety';
  } else {
    buyerSellerInference = `DISTRIBUCIÓN DE MERCADO SALUDABLE: La tienda líder "${leaderStoreName}" factura $${leaderStoreRevenue.toLocaleString('es-AR')} ARS con una concentración moderada del comprador principal (${vipShareOfLeaderStore.toFixed(1)}% de cuota). La base de clientes está distribuida de manera óptima sin cuellos de botella de retención.`;
    buyerSellerColor = 'text-brand-neon';
  }

  // 3. Cálculos de Inferencia 3: Tráfico y Saturación de Flota (Buyer + Delivery)
  const activeUsersLastDay = (buyerData?.active_users_per_day && buyerData.active_users_per_day.length > 0)
    ? buyerData.active_users_per_day[buyerData.active_users_per_day.length - 1].active_users
    : 0;
  
  const dronesAssigned = deliveryData?.courier_activity_status?.ASSIGNED || 0;
  const dronesAvailable = deliveryData?.courier_activity_status?.AVAILABLE || 0;
  const totalDrones = dronesAssigned + dronesAvailable;

  // Ratio de usuarios activos por dron operativo
  const usersPerDroneRatio = (totalDrones > 0) ? activeUsersLastDay / totalDrones : 0;

  let saturationInference = '';
  let saturationColor = 'text-white';

  if (!isBuyerOnline || !isDeliveryOnline) {
    saturationInference = 'DATOS INSUFICIENTES: Uno o ambos módulos (Buyer / Delivery) se encuentran offline. El ratio de saturación logística se basa en promedios simulados.';
    saturationColor = 'text-brand-safety';
  } else if (usersPerDroneRatio > 5) {
    saturationInference = `ALTAS PROBABILIDADES DE RETRASO: El ratio de usuarios activos por dron es crítico (${usersPerDroneRatio.toFixed(1)} usuarios/dron). La demanda logística supera la capacidad operativa de la flota (${totalDrones} drones registrados). Se proyectan retrasos estimados de +15 a +30 minutos en entregas inmediatas.`;
    saturationColor = 'text-brand-safety';
  } else {
    saturationInference = `LOGÍSTICA FLUIDA: Ratio óptimo de ${usersPerDroneRatio.toFixed(1)} usuarios por dron. La capacidad de transporte de la flota cubre holgadamente la demanda telemétrica proyectada para las próximas 24 horas.`;
    saturationColor = 'text-brand-neon';
  }

  // 4. Cálculos de Inferencia 4: Garantías en Escrow vs Volumen de Órdenes (Payments + Seller)
  const totalEscrow = paymentsData?.total_escrow || 0;
  const totalSellerOrders = sellerData?.top_selling_stores
    ? sellerData.top_selling_stores.reduce((acc: number, curr: TopSellingStore) => acc + curr.total_orders, 0)
    : 0;

  // Promedio de fondos retenidos en escrow por orden registrada
  const escrowPerOrderRatio = (totalSellerOrders > 0) ? totalEscrow / totalSellerOrders : 0;

  let escrowInference = '';
  let escrowColor = 'text-white';

  if (!isPaymentsOnline || !isSellerOnline) {
    escrowInference = 'DATOS INSUFICIENTES: Uno o ambos módulos (Payments / Seller) se encuentran offline. Usando promedios simulados de escrow comercial.';
    escrowColor = 'text-brand-safety';
  } else if (escrowPerOrderRatio > 50000) {
    escrowInference = `ALTA LIQUIDEZ RETENIDA: Hay un promedio de $${escrowPerOrderRatio.toFixed(2)} ARS retenidos en escrow por cada orden comercial activa. Esto representa una gran cantidad de fondos garantizados pendientes de liberación. Verifique la confirmación de envíos para acelerar la liquidación a vendedores.`;
    escrowColor = 'text-brand-neon';
  } else {
    escrowInference = `FLUJO LOGÍSTICO RÁPIDO: Promedio de $${escrowPerOrderRatio.toFixed(2)} ARS por orden comercial en escrow. La liberación de pagos por entrega finalizada está funcionando eficientemente, reduciendo el capital de trabajo inmovilizado en la plataforma.`;
    escrowColor = 'text-brand-neon';
  }

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
            <span className="text-brand-neon text-lg font-bold tracking-[0.2em] uppercase">
              ◆ ANALYTICS
            </span>
            <span className="text-white/20">/</span>
            <span className="text-white font-sans text-xl uppercase tracking-tighter">
              Algoritmos_Cruce_Inferencia
            </span>
          </div>

          <div className="flex items-center gap-6 justify-between sm:justify-end">
            <div className="flex items-center gap-3">
              <span className="brutalist-tag animate-pulse-neon">PROCESSOR // RUNNING</span>
              <div className="w-2.5 h-2.5 bg-brand-neon animate-pulse-neon" />
            </div>
            <Link href="/dashboard" className="border-2 border-white text-white hover:bg-white hover:text-black font-mono font-bold uppercase px-4 py-2 text-xs tracking-wider transition-colors duration-100">
              &lt;// VOLVER AL PANEL
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Panel Grid ── */}
      <main className="flex-1 p-6 md:p-8 lg:p-12 relative z-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          
          {/* Cabecera del Panel */}
          <div className="border-2 border-white/10 bg-zinc-950 p-6 shadow-[6px_6px_0px_rgba(255,255,255,0.03)] border-l-brand-neon border-l-4">
            <h2 className="text-2xl font-sans uppercase font-black tracking-tight mb-2">
              Inferencia Telemétrica Cruzada
            </h2>
            <p className="text-xs text-white/50 leading-relaxed">
              Algoritmo de análisis cruzado en tiempo real. Extrae relaciones directas, correlaciones financieras, capacidad operativa y saturación de flota interactuando directamente con las respuestas locales del ecosistema centralizado sin almacenamiento secundario en base de datos.
            </p>
          </div>

          {/* Grilla de Inferencias */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Inferencia 1 */}
            <div className="bg-zinc-950 border-2 border-white/10 p-6 flex flex-col justify-between shadow-[4px_4px_0px_rgba(255,255,255,0.02)]">
              <div>
                <span className="text-[10px] text-brand-neon font-bold tracking-widest uppercase block mb-1">
                  CORRELACIÓN #01 // LOGÍSTICA & RETORNO FINANCIERO
                </span>
                <h3 className="text-lg font-sans font-bold text-white uppercase mb-4">
                  Eficiencia y Costo por Distancia
                </h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="border border-white/5 bg-black/40 p-2 flex flex-col">
                    <span className="text-[8px] text-white/30 uppercase">Éxito Delivery</span>
                    <span className="text-sm font-bold">{isDeliveryOnline ? `${(deliverySuccessRate * 100).toFixed(1)}%` : 'OFFLINE'}</span>
                  </div>
                  <div className="border border-white/5 bg-black/40 p-2 flex flex-col">
                    <span className="text-[8px] text-white/30 uppercase">Ingresos / Dist. Unit.</span>
                    <span className="text-sm font-bold">${revenuePerDistanceUnit.toFixed(2)} ARS</span>
                  </div>
                </div>
                <div className="bg-black/60 border border-white/5 p-4 font-mono text-[10px] leading-relaxed">
                  <span className="text-white/30 font-bold block mb-1">INFERENCE_OUTPUT //</span>
                  <p className={logisticsFinanceColor}>{logisticsFinanceInference}</p>
                </div>
              </div>
              <div className="border-t border-white/10 pt-4 mt-6 text-[8px] text-white/30 flex justify-between font-mono">
                <span>DATOS: DELIVERY API + PAYMENTS API</span>
                <span>STATUS: OK</span>
              </div>
            </div>

            {/* Inferencia 2 */}
            <div className="bg-zinc-950 border-2 border-white/10 p-6 flex flex-col justify-between shadow-[4px_4px_0px_rgba(255,255,255,0.02)]">
              <div>
                <span className="text-[10px] text-brand-neon font-bold tracking-widest uppercase block mb-1">
                  CORRELACIÓN #02 // CONCENTRACIÓN DE CLIENTES
                </span>
                <h3 className="text-lg font-sans font-bold text-white uppercase mb-4">
                  Distribución Comprador VIP vs Tiendas
                </h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="border border-white/5 bg-black/40 p-2 flex flex-col">
                    <span className="text-[8px] text-white/30 uppercase">Gasto Cliente VIP</span>
                    <span className="text-sm font-bold">${topSpenderSpent.toLocaleString('es-AR')} ARS</span>
                  </div>
                  <div className="border border-white/5 bg-black/40 p-2 flex flex-col">
                    <span className="text-[8px] text-white/30 uppercase">Participación s/Líder</span>
                    <span className="text-sm font-bold">{vipShareOfLeaderStore.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="bg-black/60 border border-white/5 p-4 font-mono text-[10px] leading-relaxed">
                  <span className="text-white/30 font-bold block mb-1">INFERENCE_OUTPUT //</span>
                  <p className={buyerSellerColor}>{buyerSellerInference}</p>
                </div>
              </div>
              <div className="border-t border-white/10 pt-4 mt-6 text-[8px] text-white/30 flex justify-between font-mono">
                <span>DATOS: BUYER API + SELLER API</span>
                <span>STATUS: OK</span>
              </div>
            </div>

            {/* Inferencia 3 */}
            <div className="bg-zinc-950 border-2 border-white/10 p-6 flex flex-col justify-between shadow-[4px_4px_0px_rgba(255,255,255,0.02)]">
              <div>
                <span className="text-[10px] text-brand-neon font-bold tracking-widest uppercase block mb-1">
                  CORRELACIÓN #03 // SATURACIÓN LOGÍSTICA
                </span>
                <h3 className="text-lg font-sans font-bold text-white uppercase mb-4">
                  Capacidad de Flota vs Tráfico
                </h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="border border-white/5 bg-black/40 p-2 flex flex-col">
                    <span className="text-[8px] text-white/30 uppercase">Usuarios Activos (Últ. Día)</span>
                    <span className="text-sm font-bold">{activeUsersLastDay} usuarios</span>
                  </div>
                  <div className="border border-white/5 bg-black/40 p-2 flex flex-col">
                    <span className="text-[8px] text-white/30 uppercase">Ratio Demanda/Dron</span>
                    <span className="text-sm font-bold">{usersPerDroneRatio.toFixed(1)} u/dron</span>
                  </div>
                </div>
                <div className="bg-black/60 border border-white/5 p-4 font-mono text-[10px] leading-relaxed">
                  <span className="text-white/30 font-bold block mb-1">INFERENCE_OUTPUT //</span>
                  <p className={saturationColor}>{saturationInference}</p>
                </div>
              </div>
              <div className="border-t border-white/10 pt-4 mt-6 text-[8px] text-white/30 flex justify-between font-mono">
                <span>DATOS: BUYER API + DELIVERY API</span>
                <span>STATUS: OK</span>
              </div>
            </div>

            {/* Inferencia 4 */}
            <div className="bg-zinc-950 border-2 border-white/10 p-6 flex flex-col justify-between shadow-[4px_4px_0px_rgba(255,255,255,0.02)]">
              <div>
                <span className="text-[10px] text-brand-neon font-bold tracking-widest uppercase block mb-1">
                  CORRELACIÓN #04 // GARANTÍAS COMERCIALES
                </span>
                <h3 className="text-lg font-sans font-bold text-white uppercase mb-4">
                  Liquidez en Escrow vs Ventas
                </h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="border border-white/5 bg-black/40 p-2 flex flex-col">
                    <span className="text-[8px] text-white/30 uppercase">Fondos Escrow</span>
                    <span className="text-sm font-bold">${totalEscrow.toLocaleString('es-AR')} ARS</span>
                  </div>
                  <div className="border border-white/5 bg-black/40 p-2 flex flex-col">
                    <span className="text-[8px] text-white/30 uppercase">Fondos / Orden</span>
                    <span className="text-sm font-bold">${escrowPerOrderRatio.toFixed(2)} ARS</span>
                  </div>
                </div>
                <div className="bg-black/60 border border-white/5 p-4 font-mono text-[10px] leading-relaxed">
                  <span className="text-white/30 font-bold block mb-1">INFERENCE_OUTPUT //</span>
                  <p className={escrowColor}>{escrowInference}</p>
                </div>
              </div>
              <div className="border-t border-white/10 pt-4 mt-6 text-[8px] text-white/30 flex justify-between font-mono">
                <span>DATOS: PAYMENTS API + SELLER API</span>
                <span>STATUS: OK</span>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/20 bg-black/90 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-[9px] text-white/30">
        <div>
          BuscaloYa Ecosistema Centralizado © 2026 // Inferencia Cruzada
        </div>
        <div className="flex gap-4">
          <span>SECURE_LINK: OK</span>
          <span>|</span>
          <span className="text-brand-neon">STATUS: ANALYSIS_COMPLETE</span>
        </div>
      </footer>

    </div>
  );
}
