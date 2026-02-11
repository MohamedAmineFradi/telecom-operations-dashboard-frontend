// Cell hooks

import { useQuery, UseQueryResult } from '@tanstack/react-query'
import type { CellDetails, TimeSeriesData } from '@/lib/types'
import { cellApi } from '@/lib/api/cells'

export function useCellDetails(cellId: number): UseQueryResult<CellDetails, Error> {
  return useQuery({
    queryKey: ['cellDetails', cellId],
    queryFn: () => cellApi.getCellDetails(cellId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useCellTimeseries(
  cellId: number,
  from: string,
  to: string,
  step: 'hour' | 'day' | 'minute' = 'hour'
): UseQueryResult<TimeSeriesData[], Error> {
  return useQuery({
    queryKey: ['cellTimeseries', cellId, from, to, step],
    queryFn: () => cellApi.getCellTimeseries(cellId, from, to, step),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useGridCells() {
  return useQuery({
    queryKey: ['gridCells'],
    queryFn: () => cellApi.getAllCells(),
  })
}
