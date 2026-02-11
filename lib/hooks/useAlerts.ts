// Alerts hooks

import { useMutation, useQuery, useQueryClient, UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import type { Alert } from '@/lib/types'
import { alertsApi } from '@/lib/api/alerts'

export function useAlerts(since?: string): UseQueryResult<Alert[], Error> {
  return useQuery({
    queryKey: ['alerts', since],
    queryFn: () => alertsApi.getAlerts(since),
    staleTime: 1000 * 60, // 1 minute
  })
}

export function useResolveAlert(): UseMutationResult<void, Error, string | number, unknown> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (alertId: string | number) => alertsApi.resolveAlert(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
    },
  })
}
