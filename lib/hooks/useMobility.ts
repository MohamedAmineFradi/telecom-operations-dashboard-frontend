'use client'

import { useQuery } from '@tanstack/react-query';
import { mobilityApi } from '@/lib/api/mobility';

export function useMobilityFlows(hour: string, cellId?: number, provincia?: string) {
  return useQuery({
    queryKey: ['mobilityFlows', hour, cellId, provincia],
    queryFn: () => mobilityApi.getMobilityFlowsAtHour(hour, cellId, provincia),
    enabled: !!hour,
    staleTime: 1000 * 60 * 5,
  });
}

export function useProvinceSummaries(hour: string, provincia?: string) {
  return useQuery({
    queryKey: ['provinceSummaries', hour, provincia],
    queryFn: () => mobilityApi.getProvinceSummariesAtHour(hour, provincia),
    enabled: !!hour,
    staleTime: 1000 * 60 * 5,
  });
}
