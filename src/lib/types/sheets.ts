export interface SheetData {
  departamento: string;
  lat: number;
  lng: number;
  poblacion: number;
  audienciaFbA: number;
  audienciaFbB: number;
  audienciaGmp: number;
  whatsapp: number;
}

export interface AudienceTotals {
  fbA: number;
  fbB: number;
  gmp: number;
  whatsapp: number;
  total: number;
}