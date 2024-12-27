export interface SheetData {
  departamento: string;
  lat: number;
  lng: number;
  poblacion: number;
  escuelas: number;
  hospitales: number;
  presupuesto: number;
  audienciaFbA: number;
  audienciaFbB: number;
  audienciaGmp: number;
  whatsapp: number;
  analisis?: string;
  recomendaciones?: string;
  conclusiones?: string;
}

export interface AudienceTotals {
  fbA: number;
  fbB: number;
  gmp: number;
  whatsapp: number;
  total: number;
}