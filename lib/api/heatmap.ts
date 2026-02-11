import type { HeatmapCellDto, TopCellDto, HourlyCellDto } from '@/lib/types'
import { BaseApiClient } from './base'

export class HeatmapApiClient extends BaseApiClient {
  async getHeatmap(datetime: string): Promise<HeatmapCellDto[]> {
    return this.fetch<HeatmapCellDto[]>(
      `/traffic/heatmap?datetime=${encodeURIComponent(datetime)}`
    )
  }

  async getTopCells(hour: string, limit: number = 10): Promise<TopCellDto[]> {
    return this.fetch<TopCellDto[]>(
      `/traffic/top-cells?hour=${encodeURIComponent(hour)}&limit=${limit}`
    )
  }

  async getAllCellsAtHour(hour: string): Promise<HourlyCellDto[]> {
    return this.fetch<HourlyCellDto[]>(
      `/traffic/hourly?hour=${encodeURIComponent(hour)}`
    )
  }
}

export const heatmapApi = new HeatmapApiClient()
