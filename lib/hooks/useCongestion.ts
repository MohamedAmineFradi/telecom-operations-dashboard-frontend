'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { congestionApi } from '@/lib/api/congestion';

export function useCongestion(hour: string, warn: number = 70, crit: number = 90) {
    return useQuery({
        queryKey: ['congestion', hour, warn, crit],
        queryKeyHashFn: (queryKey) => JSON.stringify(queryKey),
        queryFn: () => congestionApi.getCongestionAtHour(hour, 100, warn, crit),
        enabled: !!hour,
    });
}

export function useHourlySummary(hour: string) {
    return useQuery({
        queryKey: ['hourly-summary', hour],
        queryFn: () => congestionApi.getHourlySummary(hour),
        enabled: !!hour,
    });
}

export function useGenerateCongestionAlerts() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ hour, warn, crit }: { hour: string; warn: number; crit: number }) =>
            congestionApi.generateCongestionAlerts(hour, 100, warn, crit),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['alerts'] });
        },
    });
}
