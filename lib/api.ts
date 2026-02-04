// API client for telecom dashboard with React Query

import type { 
  HeatmapCell, 
  TopCellDto, 
  Alert, 
  TimeSeriesData,
  CellDetails,
  MobilityFlow,
  NetworkStats
} from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

class ApiClient {
  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    if (process.env.NODE_ENV !== 'production') {
      const method = options?.method ?? 'GET'
      // eslint-disable-next-line no-console
      console.info(`[API] ${method} ${API_BASE_URL}${endpoint}`)
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    return response.json()
  }

  // Heatmap data
  async getHeatmap(datetime: string): Promise<HeatmapCell[]> {
    return this.fetch<HeatmapCell[]>(`/traffic/heatmap?datetime=${encodeURIComponent(datetime)}`)
  }

  // Top cells by activity
  async getTopCells(hour: string, limit: number = 10): Promise<TopCellDto[]> {
    return this.fetch<TopCellDto[]>(
      `/traffic/top-cells?hour=${encodeURIComponent(hour)}&limit=${limit}`
    )
  }

  // Cell details
  async getCellDetails(cellId: number): Promise<CellDetails> {
    return this.fetch<CellDetails>(`/cells/${cellId}`)
  }

  // Time series for a cell
  async getCellTimeseries(
    cellId: number, 
    from: string, 
    to: string,
    step: 'hour' | 'day' | 'minute' = 'hour'
  ): Promise<TimeSeriesData[]> {
    return this.fetch<TimeSeriesData[]>(
      `/traffic/cells/${cellId}/timeseries?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&step=${step}`
    )
  }

  // Alerts
  async getAlerts(since?: string): Promise<Alert[]> {
    const query = since ? `?since=${encodeURIComponent(since)}` : ''
    return this.fetch<Alert[]>(`/alerts${query}`)
  }

  async resolveAlert(alertId: string): Promise<void> {
    await this.fetch<void>(`/alerts/${alertId}/resolve`, {
      method: 'POST',
    })
  }

  // Mobility flows
  async getMobilityFlows(): Promise<MobilityFlow[]> {
    return this.fetch<MobilityFlow[]>(`/mobility`)
  }

  // Network statistics
  async getNetworkStats(): Promise<NetworkStats> {
    return this.fetch<NetworkStats>(`/stats`)
  }

  // Stream slot (trigger data ingestion)
  async streamSlot(datetime?: string): Promise<{ slotDatetime: string; sentEvents: number }> {
    const query = datetime ? `?datetime=${encodeURIComponent(datetime)}` : ''
    return this.fetch<{ slotDatetime: string; sentEvents: number }>(
      `/stream/slot${query}`,
      { method: 'POST' }
    )
  }
}

export const api = new ApiClient()

// ============================================
// React Query Hooks
// ============================================
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query'

/**
 * Hook for fetching heatmap data
 */
export function useHeatmap(datetime: string): UseQueryResult<HeatmapCell[], Error> {
  return useQuery({
    queryKey: ['heatmap', datetime],
    queryFn: () => api.getHeatmap(datetime),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook for fetching top cells
 */
export function useTopCells(datetime: string, limit = 10): UseQueryResult<TopCellDto[], Error> {
  return useQuery({
    queryKey: ['topCells', datetime, limit],
    queryFn: () => api.getTopCells(datetime, limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook for streaming slot data (triggers data refresh)
 */
export function useStreamSlot(): UseMutationResult<
  { slotDatetime: string; sentEvents: number },
  Error,
  string | undefined,
  unknown
> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (datetime?: string) => api.streamSlot(datetime),
    onSuccess: () => {
      // Invalidate all queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['heatmap'] })
      queryClient.invalidateQueries({ queryKey: ['topCells'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
  })
}
