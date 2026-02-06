// Statistics hooks

import { useMutation, useQuery, useQueryClient, UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import type { NetworkStats } from '@/lib/types'
import { statsApi } from '@/lib/api/stats'

export function useNetworkStats(): UseQueryResult<NetworkStats, Error> {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => statsApi.getNetworkStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useStreamSlot(): UseMutationResult<
  { slotDatetime: string; sentEvents: number },
  Error,
  string | undefined,
  unknown
> {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (datetime?: string) => statsApi.streamSlot(datetime),
    onSuccess: () => {
      // Invalidate all related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['heatmap'] })
      queryClient.invalidateQueries({ queryKey: ['topCells'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
  })
}
