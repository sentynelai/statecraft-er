import useSWR from 'swr';
import { fetchSheetData } from '../lib/services/sheetService';
import type { SheetData } from '../lib/types/sheets';

export function useProvincialData() {
  const { data, error, isLoading } = useSWR<SheetData[]>(
    'provincial-data',
    async () => {
      try {
        return await fetchSheetData();
      } catch (error) {
        console.error('Failed to fetch provincial data:', error);
        return []; // Return empty array instead of throwing
      }
    },
    {
      refreshInterval: 300000, // 5 minutes
      revalidateOnFocus: true,
      dedupingInterval: 60000, // 1 minute
      errorRetryCount: 3,
      fallbackData: [],
      suspense: false,
      shouldRetryOnError: true
    }
  );

  return {
    data: data || [],
    isLoading,
    isError: error,
    isEmpty: !isLoading && !error && (!data || data.length === 0)
  };
}

// Export both names for compatibility
export const useStoreData = useProvincialData;