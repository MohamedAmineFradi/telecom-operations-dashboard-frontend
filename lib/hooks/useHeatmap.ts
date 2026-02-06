// Heatmap hooks

import { useQuery, UseQueryResult } from '@tanstack/react-query'
import type { HeatmapCell, TopCellDto } from '@/lib/types'
import { heatmapApi } from '@/lib/api/heatmap'

export function useHeatmap(datetime: string): UseQueryResult<HeatmapCell[], Error> {
  return useQuery({
    queryKey: ['heatmap', datetime],
    queryFn: () => heatmapApi.getHeatmap(datetime),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useTopCells(datetime: string, limit = 10): UseQueryResult<TopCellDto[], Error> {
  return useQuery({
    queryKey: ['topCells', datetime, limit],
    queryFn: () => heatmapApi.getTopCells(datetime, limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
