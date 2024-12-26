import { SheetData } from '../types/sheets';

const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const SHEET_NAME = 'Demografia';
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

async function validateEnvironment() {
  if (!API_KEY) {
    throw new Error('Missing Google Sheets API key');
  }
  if (!SPREADSHEET_ID) {
    throw new Error('Missing Google Spreadsheet ID');
  }
}

function parseNumber(value: string | undefined): number {
  if (!value) return 0;
  const cleanValue = value.replace(/[^\d.-]/g, '');
  const number = parseFloat(cleanValue);
  return isNaN(number) ? 0 : number;
}

async function fetchWithRetry(url: string, attempt = 1): Promise<Response> {
  try {
    const response = await fetch(url);
    
    if (response.status === 403) {
      throw new Error('Access denied. Please check API key permissions.');
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    if (attempt < RETRY_ATTEMPTS) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
      return fetchWithRetry(url, attempt + 1);
    }
    throw error;
  }
}

export async function fetchSheetData(): Promise<SheetData[]> {
  try {
    await validateEnvironment();
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A2:R?key=${API_KEY}`;
    const response = await fetchWithRetry(url);
    const data = await response.json();
    
    if (!data.values || !Array.isArray(data.values)) {
      console.warn('No data found in spreadsheet');
      return [];
    }

    return data.values
      .filter(row => Array.isArray(row) && row.length >= 18)
      .map(row => ({
        departamento: String(row[3] || '').trim(),
        lat: parseNumber(row[6]),
        lng: parseNumber(row[7]),
        poblacion: parseNumber(row[8]),
        audienciaFbA: parseNumber(row[14]),
        audienciaFbB: parseNumber(row[15]),
        audienciaGmp: parseNumber(row[16]),
        whatsapp: parseNumber(row[17])
      }))
      .filter(item => 
        item.departamento && 
        item.lat !== 0 && 
        item.lng !== 0 && 
        item.poblacion > 0
      );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Sheet fetch error:', errorMessage);
    throw new Error(`Failed to fetch sheet data: ${errorMessage}`);
  }
}