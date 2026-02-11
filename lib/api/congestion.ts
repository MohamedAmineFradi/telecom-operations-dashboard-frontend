// Congestion API client
import { BaseApiClient } from './base'
import { CongestionCellDto, HourlyTrafficSummaryDto, AlertDto } from '@/lib/types'

export class CongestionApiClient extends BaseApiClient {
    async getCongestionAtHour(
        hour: string,
        limit: number = 100,
        warn: number = 70,
        crit: number = 90
    ): Promise<CongestionCellDto[]> {
        return this.fetch<CongestionCellDto[]>(
            `/traffic/congestion?hour=${encodeURIComponent(hour)}&limit=${limit}&warn=${warn}&crit=${crit}`
        );
    }

    async getHourlySummary(hour: string): Promise<HourlyTrafficSummaryDto> {
        return this.fetch<HourlyTrafficSummaryDto>(
            `/traffic/hourly-summary?hour=${encodeURIComponent(hour)}`
        );
    }

    async generateCongestionAlerts(
        hour: string,
        limit: number = 100,
        warn: number = 70,
        crit: number = 90
    ): Promise<AlertDto[]> {
        return this.fetch<AlertDto[]>(
            `/alerts/congestion?hour=${encodeURIComponent(hour)}&limit=${limit}&warn=${warn}&crit=${crit}`,
            { method: 'POST' }
        );
    }
}

export const congestionApi = new CongestionApiClient()
