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

import { DashboardHeader } from '@/app/ui/layout/DashboardHeader';
import { DashboardFooter } from '@/app/ui/layout/DashboardFooter';
import { InferenceCard, InferenceCardData } from '@/app/ui/inference/InferenceCard';

export const dynamic = 'force-dynamic';

export default async function InferencePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // Resolver searchParams
  const resolvedParams = await searchParams;
  const pageParam = resolvedParams?.page;
  const currentPage = Math.max(1, Number(pageParam) || 1);

  // Carga paralela de todas las APIs
  const [deliveryData, buyerData, sellerData, paymentsData] = await Promise.all([
    getDeliveryAnalytics(),
    getBuyerAnalytics(),
    getSellerAnalytics(),
    getPaymentsAnalytics(),
  ]);

  const isDeliveryOnline = !!deliveryData;
  const isBuyerOnline = !!buyerData;
  const isSellerOnline = !!sellerData;
  const isPaymentsOnline = !!paymentsData;

  // ──── CÁLCULO DE INFERENCIAS ────

  // Inferencia 1: Logística vs Finanzas (Delivery + Payments)
  const deliverySuccessRate = deliveryData?.success_rate?.rate || 0;
  const averageDistance = deliveryData?.delivery_distances?.average_distance || 0;
  const totalRevenue = paymentsData?.total_revenue || 0;
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

  // Inferencia 2: Concentración de Clientes VIP vs Tiendas (Buyer + Seller)
  const topSpenderName = buyerData?.top_buyers_by_amount?.[0]?.name || 'N/A';
  const topSpenderSpent = buyerData?.top_buyers_by_amount?.[0]?.total_spent || 0;
  const leaderStoreName = sellerData?.top_selling_stores?.[0]?.store_name || 'N/A';
  const leaderStoreRevenue = sellerData?.top_selling_stores?.[0]?.total_revenue || 0;
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

  // Inferencia 3: Tráfico y Saturación de Flota (Buyer + Delivery)
  const activeUsersLastDay = (buyerData?.active_users_per_day && buyerData.active_users_per_day.length > 0)
    ? buyerData.active_users_per_day[buyerData.active_users_per_day.length - 1].active_users
    : 0;
  const dronesAssigned = deliveryData?.courier_activity_status?.ASSIGNED || 0;
  const dronesAvailable = deliveryData?.courier_activity_status?.AVAILABLE || 0;
  const totalDrones = dronesAssigned + dronesAvailable;
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

  // Inferencia 4: Garantías en Escrow vs Volumen de Órdenes (Payments + Seller)
  const totalEscrow = paymentsData?.total_escrow || 0;
  const totalSellerOrders = sellerData?.top_selling_stores
    ? sellerData.top_selling_stores.reduce((acc: number, curr: TopSellingStore) => acc + curr.total_orders, 0)
    : 0;
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

  // Inferencia 5: Crecimiento de Ecosistema y Adopción (Payments + Buyer)
  const totalTransactions = paymentsData?.total_transactions || 0;
  const newUsersCount = buyerData?.new_users_per_day?.reduce((acc, curr) => acc + curr.new_users, 0) || 0;
  const txPerNewUserRatio = newUsersCount > 0 ? totalTransactions / newUsersCount : 0;

  let ecosystemInference = '';
  let ecosystemColor = 'text-white';

  if (!isPaymentsOnline || !isBuyerOnline) {
    ecosystemInference = 'DATOS INSUFICIENTES: Módulo de Payments o Buyer fuera de línea. No se puede calcular el ratio de adopción transaccional de nuevos usuarios.';
    ecosystemColor = 'text-brand-safety';
  } else if (txPerNewUserRatio > 1.5) {
    ecosystemInference = `ALTA CONVERSIÓN DE USUARIOS: Se registran ${txPerNewUserRatio.toFixed(2)} transacciones por cada nuevo usuario registrado en el último periodo. Indica un fuerte engagement inicial y un proceso de onboarding financiero exitoso en la pasarela.`;
    ecosystemColor = 'text-brand-neon';
  } else {
    ecosystemInference = `ONBOARDING LENTO / INACTIVO: Con solo ${txPerNewUserRatio.toFixed(2)} transacciones por nuevo usuario, el volumen de registros no está convirtiendo en actividad económica. Se recomienda lanzar campañas de activación de billetera digital.`;
    ecosystemColor = 'text-brand-safety';
  }

  // Inferencia 6: Costo de Envío Relativo (Payments + Delivery)
  // Intentar obtener total_delivery_cost de Payments o estimarlo basándose en entregas
  const totalDeliveryCost = paymentsData?.total_delivery_cost ??
    ((deliveryData?.success_rate?.delivered || 0) * (deliveryData?.delivery_distances?.average_distance || 0) * 150);
  
  const deliveryCostRatio = totalRevenue > 0 ? (totalDeliveryCost / totalRevenue) * 100 : 0;

  let deliveryCostInference = '';
  let deliveryCostColor = 'text-white';

  if (!isPaymentsOnline || !isDeliveryOnline) {
    deliveryCostInference = 'DATOS INSUFICIENTES: No es posible vincular los costos logísticos agregados con los ingresos brutos debido a fallas de conexión telemétrica.';
    deliveryCostColor = 'text-brand-safety';
  } else if (deliveryCostRatio > 25) {
    deliveryCostInference = `ALERTA DE MARGEN LOGÍSTICO: Los costos estimados de entrega representan el ${deliveryCostRatio.toFixed(1)}% de la facturación global de la plataforma ($${totalDeliveryCost.toLocaleString('es-AR')} ARS). Los costos logísticos están presionando los márgenes netos. Considere tarifas dinámicas.`;
    deliveryCostColor = 'text-brand-safety';
  } else {
    deliveryCostInference = `LOGÍSTICA RENTABLE: El costo de entrega representa el ${deliveryCostRatio.toFixed(1)}% de la facturación bruta total de la plataforma. La relación costo-ingreso de la flota de drones se mantiene en niveles saludables e ideales para escalabilidad.`;
    deliveryCostColor = 'text-brand-neon';
  }

  // Inferencia 7: Índice CSAT Proyectado (Delivery + Buyer)
  // CSAT estimado combinando tasa de éxito de entregas y saturación
  const projectedCsat = Math.min(100, Math.max(0, (deliverySuccessRate * 80) + (100 - (deliverySuccessRate * 100 < 80 ? 20 : 0))));

  let csatInference = '';
  let csatColor = 'text-white';

  if (!isDeliveryOnline || !isBuyerOnline) {
    csatInference = 'DATOS INSUFICIENTES: Imposible proyectar satisfacción al cliente (CSAT) sin telemetría de envío o actividad de usuarios.';
    csatColor = 'text-brand-safety';
  } else if (projectedCsat >= 85) {
    csatInference = `RETENCIÓN SALUDABLE: CSAT Proyectado en un ${projectedCsat.toFixed(1)}%. La alta efectividad en entregas directas está consolidando la lealtad del usuario activo en las zonas de mayor demanda.`;
    csatColor = 'text-brand-neon';
  } else {
    csatInference = `RIESGO DE DEGRADACIÓN CSAT: CSAT estimado en un ${projectedCsat.toFixed(1)}% debido a demoras de logística o cancelaciones recurrentes de la flota. Se recomienda auditar los tiempos de despacho inmediatamente.`;
    csatColor = 'text-brand-safety';
  }

  // Inferencia 8: Monopolio de Tienda Líder (Seller + Payments)
  const storeConcentration = totalRevenue > 0 ? (leaderStoreRevenue / totalRevenue) * 100 : 0;

  let concentrationInference = '';
  let concentrationColor = 'text-white';

  if (!isSellerOnline || !isPaymentsOnline) {
    concentrationInference = 'DATOS INSUFICIENTES: Fallas de red en Seller o Payments impiden calcular el índice de concentración de mercado por merchant.';
    concentrationColor = 'text-brand-safety';
  } else if (storeConcentration > 40) {
    concentrationInference = `ALTA CONCENTRACIÓN DE MERCADO: La tienda "${leaderStoreName}" acapara el ${storeConcentration.toFixed(1)}% de la facturación global registrada en pasarela. Existe una dependencia crítica del ecosistema sobre este único vendedor principal.`;
    concentrationColor = 'text-brand-safety';
  } else {
    concentrationInference = `DISTRIBUCIÓN EQUITATIVA: La tienda líder representa un ${storeConcentration.toFixed(1)}% de los ingresos de pagos comerciales. Diversidad de catálogo saludable con múltiples tiendas compitiendo en igualdad de condiciones.`;
    concentrationColor = 'text-brand-neon';
  }

  // ──── DEFINICIÓN Y SEGMENTACIÓN DE MÓDULOS (INFERENCIAS) ────

  const allInferences: InferenceCardData[] = [
    {
      id: 1,
      correlationCode: 'CORRELACIÓN #01 // LOGÍSTICA & RETORNO FINANCIERO',
      title: 'Eficiencia y Costo por Distancia',
      indicators: [
        { label: 'Éxito Delivery', value: isDeliveryOnline ? `${(deliverySuccessRate * 100).toFixed(1)}%` : 'OFFLINE' },
        { label: 'Ingresos / Dist. Unit.', value: `$${revenuePerDistanceUnit.toFixed(2)} ARS` }
      ],
      inferenceTitle: 'INFERENCE_OUTPUT //',
      inferenceText: logisticsFinanceInference,
      textColorClass: logisticsFinanceColor,
      dataSource: 'DELIVERY API + PAYMENTS API',
      status: isDeliveryOnline && isPaymentsOnline ? 'OK' : 'DEGRADED'
    },
    {
      id: 2,
      correlationCode: 'CORRELACIÓN #02 // CONCENTRACIÓN DE CLIENTES',
      title: 'Distribución Comprador VIP vs Tiendas',
      indicators: [
        { label: 'Gasto Cliente VIP', value: `$${topSpenderSpent.toLocaleString('es-AR')} ARS` },
        { label: 'Participación s/Líder', value: `${vipShareOfLeaderStore.toFixed(1)}%` }
      ],
      inferenceTitle: 'INFERENCE_OUTPUT //',
      inferenceText: buyerSellerInference,
      textColorClass: buyerSellerColor,
      dataSource: 'BUYER API + SELLER API',
      status: isBuyerOnline && isSellerOnline ? 'OK' : 'DEGRADED'
    },
    {
      id: 3,
      correlationCode: 'CORRELACIÓN #03 // SATURACIÓN LOGÍSTICA',
      title: 'Capacidad de Flota vs Tráfico',
      indicators: [
        { label: 'Usuarios Activos (Últ. Día)', value: `${activeUsersLastDay} usuarios` },
        { label: 'Ratio Demanda/Dron', value: `${usersPerDroneRatio.toFixed(1)} u/dron` }
      ],
      inferenceTitle: 'INFERENCE_OUTPUT //',
      inferenceText: saturationInference,
      textColorClass: saturationColor,
      dataSource: 'BUYER API + DELIVERY API',
      status: isBuyerOnline && isDeliveryOnline ? 'OK' : 'DEGRADED'
    },
    {
      id: 4,
      correlationCode: 'CORRELACIÓN #04 // GARANTÍAS COMERCIALES',
      title: 'Liquidez en Escrow vs Ventas',
      indicators: [
        { label: 'Fondos Escrow', value: `$${totalEscrow.toLocaleString('es-AR')} ARS` },
        { label: 'Fondos / Orden', value: `$${escrowPerOrderRatio.toFixed(2)} ARS` }
      ],
      inferenceTitle: 'INFERENCE_OUTPUT //',
      inferenceText: escrowInference,
      textColorClass: escrowColor,
      dataSource: 'PAYMENTS API + SELLER API',
      status: isPaymentsOnline && isSellerOnline ? 'OK' : 'DEGRADED'
    },
    {
      id: 5,
      correlationCode: 'CORRELACIÓN #05 // CRECIMIENTO & ADOPCIÓN',
      title: 'Conversión de Nuevos Usuarios',
      indicators: [
        { label: 'Transacciones Totales', value: `${totalTransactions}` },
        { label: 'Transac. / Reg. Nuevo', value: `${txPerNewUserRatio.toFixed(2)} tx/u` }
      ],
      inferenceTitle: 'INFERENCE_OUTPUT //',
      inferenceText: ecosystemInference,
      textColorClass: ecosystemColor,
      dataSource: 'PAYMENTS API + BUYER API',
      status: isPaymentsOnline && isBuyerOnline ? 'OK' : 'DEGRADED'
    },
    {
      id: 6,
      correlationCode: 'CORRELACIÓN #06 // ANÁLISIS DE COSTO RELATIVO',
      title: 'Costo Logístico sobre Facturación',
      indicators: [
        { label: 'Costo Envío Estimado', value: `$${totalDeliveryCost.toLocaleString('es-AR')} ARS` },
        { label: 'Impacto s/Ingresos', value: `${deliveryCostRatio.toFixed(1)}%` }
      ],
      inferenceTitle: 'INFERENCE_OUTPUT //',
      inferenceText: deliveryCostInference,
      textColorClass: deliveryCostColor,
      dataSource: 'PAYMENTS API + DELIVERY API',
      status: isPaymentsOnline && isDeliveryOnline ? 'OK' : 'DEGRADED'
    },
    {
      id: 7,
      correlationCode: 'CORRELACIÓN #07 // TELEMETRÍA Y SATISFACCIÓN',
      title: 'CSAT Telemétrico Proyectado',
      indicators: [
        { label: 'Éxito Logístico', value: isDeliveryOnline ? `${(deliverySuccessRate * 100).toFixed(1)}%` : 'OFFLINE' },
        { label: 'Satisfacción Proyectada', value: `${projectedCsat.toFixed(1)}%` }
      ],
      inferenceTitle: 'INFERENCE_OUTPUT //',
      inferenceText: csatInference,
      textColorClass: csatColor,
      dataSource: 'DELIVERY API + BUYER API',
      status: isDeliveryOnline && isBuyerOnline ? 'OK' : 'DEGRADED'
    },
    {
      id: 8,
      correlationCode: 'CORRELACIÓN #08 // DISTRIBUCIÓN DE MERCADO',
      title: 'Monopolio vs Diversidad Comercial',
      indicators: [
        { label: 'Ventas Tienda Líder', value: `$${leaderStoreRevenue.toLocaleString('es-AR')} ARS` },
        { label: 'Concentración Bruta', value: `${storeConcentration.toFixed(1)}%` }
      ],
      inferenceTitle: 'INFERENCE_OUTPUT //',
      inferenceText: concentrationInference,
      textColorClass: concentrationColor,
      dataSource: 'SELLER API + PAYMENTS API',
      status: isSellerOnline && isPaymentsOnline ? 'OK' : 'DEGRADED'
    }
  ];

  // Paginación
  const cardsPerPage = 4;
  const totalCards = allInferences.length;
  const totalPages = Math.ceil(totalCards / cardsPerPage);
  
  // Limitar página entre 1 y totalPages
  const activePage = Math.min(totalPages, Math.max(1, currentPage));
  const startIndex = (activePage - 1) * cardsPerPage;
  const paginatedInferences = allInferences.slice(startIndex, startIndex + cardsPerPage);

  return (
    <>
      <DashboardHeader 
        title="Algoritmos_Cruce_Inferencia" 
        tagLabel="PROCESSOR // RUNNING" 
        showInferenceLink={false} 
        backLink="/dashboard" 
        backText="<// VOLVER AL PANEL" 
      />

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
            {paginatedInferences.map((card) => (
              <InferenceCard key={card.id} card={card} />
            ))}
          </div>

          {/* Controles Brutalistas de Paginación */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 border-2 border-white/10 bg-zinc-950 p-4 shadow-[4px_4px_0px_rgba(255,255,255,0.02)] border-l-brand-neon border-l-2">
            {activePage > 1 ? (
              <Link 
                href={`?page=${activePage - 1}`}
                className="border-2 border-white text-white hover:bg-white hover:text-black font-mono font-bold uppercase px-4 py-2 text-xs tracking-wider transition-colors duration-100"
              >
                ◀ ANTERIOR // PREV
              </Link>
            ) : (
              <span className="border-2 border-white/10 text-white/20 font-mono font-bold uppercase px-4 py-2 text-xs tracking-wider cursor-not-allowed select-none">
                ◀ ANTERIOR // PREV
              </span>
            )}

            <span className="text-brand-neon font-mono text-sm tracking-widest font-bold">
              [ PAGE 0{activePage} / 0{totalPages} ]
            </span>

            {activePage < totalPages ? (
              <Link 
                href={`?page=${activePage + 1}`}
                className="border-2 border-white text-white hover:bg-white hover:text-black font-mono font-bold uppercase px-4 py-2 text-xs tracking-wider transition-colors duration-100"
              >
                SIGUIENTE // NEXT ▶
              </Link>
            ) : (
              <span className="border-2 border-white/10 text-white/20 font-mono font-bold uppercase px-4 py-2 text-xs tracking-wider cursor-not-allowed select-none">
                SIGUIENTE // NEXT ▶
              </span>
            )}
          </div>

        </div>
      </main>

      <DashboardFooter label="Inferencia Cruzada" status="ANALYSIS_COMPLETE" />
    </>
  );
}
