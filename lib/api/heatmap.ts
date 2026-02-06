// Heatmap API client

import type { HeatmapCell, TopCellDto } from '@/lib/types'
import { BaseApiClient } from './base'

export class HeatmapApiClient extends BaseApiClient {
  async getHeatmap(datetime: string): Promise<HeatmapCell[]> {
    return this.fetch<HeatmapCell[]>(
      `/traffic/heatmap?datetime=${encodeURIComponent(datetime)}`
    )
  }

  async getTopCells(hour: string, limit: number = 10): Promise<TopCellDto[]> {
    return this.fetch<TopCellDto[]>(
      `/traffic/top-cells?hour=${encodeURIComponent(hour)}&limit=${limit}`
    )
  }
}

export const heatmapApi = new HeatmapApiClient()
