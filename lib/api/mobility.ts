// Mobility API client

import type { MobilityFlow } from '@/lib/types'
import { BaseApiClient } from './base'

export class MobilityApiClient extends BaseApiClient {
  async getMobilityFlows(): Promise<MobilityFlow[]> {
    return this.fetch<MobilityFlow[]>(`/mobility`)
  }
}

export const mobilityApi = new MobilityApiClient()
