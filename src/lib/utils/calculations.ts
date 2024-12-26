import type { SheetData, AudienceTotals } from '../types/sheets';

export function calculateTotalPopulation(data: SheetData[]): number {
  if (!Array.isArray(data)) return 0;
  
  return data.reduce((total, item) => {
    const population = typeof item.poblacion === 'number' ? item.poblacion : 0;
    return total + population;
  }, 0);
}

export function calculateAudienceTotals(data: SheetData[]): AudienceTotals {
  if (!Array.isArray(data)) {
    return { fbA: 0, fbB: 0, gmp: 0, whatsapp: 0, total: 0 };
  }
  
  const totals = data.reduce((acc, item) => ({
    fbA: acc.fbA + (Number(item.audienciaFbA) || 0),
    fbB: acc.fbB + (Number(item.audienciaFbB) || 0),
    gmp: acc.gmp + (Number(item.audienciaGmp) || 0),
    whatsapp: acc.whatsapp + (Number(item.whatsapp) || 0)
  }), { fbA: 0, fbB: 0, gmp: 0, whatsapp: 0 });

  const total = Object.values(totals).reduce((sum, val) => sum + val, 0);

  return {
    ...totals,
    total
  };
}