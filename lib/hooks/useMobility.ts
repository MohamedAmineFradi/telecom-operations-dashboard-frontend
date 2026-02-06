// Mobility hooks

import { useQuery, UseQueryResult } from '@tanstack/react-query'
import type { MobilityFlow } from '@/lib/types'
import { mobilityApi } from '@/lib/api/mobility'

export function useMobilityFlows(): UseQueryResult<MobilityFlow[], Error> {
  return useQuery({
    queryKey: ['mobilityFlows'],
    queryFn: () => mobilityApi.getMobilityFlows(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
