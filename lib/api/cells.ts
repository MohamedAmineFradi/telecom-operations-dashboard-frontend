// Cell API client

import type { CellDetails, TimeSeriesData } from '@/lib/types'
import { BaseApiClient } from './base'

export class CellApiClient extends BaseApiClient {
  async getCellDetails(cellId: number): Promise<CellDetails> {
    return this.fetch<CellDetails>(`/cells/${cellId}`)
  }

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
}

export const cellApi = new CellApiClient()
