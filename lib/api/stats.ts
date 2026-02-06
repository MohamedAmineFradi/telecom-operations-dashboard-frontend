// Network statistics API client

import type { NetworkStats } from '@/lib/types'
import { BaseApiClient } from './base'

export class StatsApiClient extends BaseApiClient {
  async getNetworkStats(): Promise<NetworkStats> {
    return this.fetch<NetworkStats>(`/stats`)
  }

  async streamSlot(datetime?: string): Promise<{ slotDatetime: string; sentEvents: number }> {
    const query = datetime ? `?datetime=${encodeURIComponent(datetime)}` : ''
    return this.fetch<{ slotDatetime: string; sentEvents: number }>(
      `/stream/slot${query}`,
      { method: 'POST' }
    )
  }
}

export const statsApi = new StatsApiClient()
