import type { MobilityCellProvinceFlowDto, MobilityProvinceSummaryDto } from '@/lib/types'
import { BaseApiClient } from './base'

export class MobilityApiClient extends BaseApiClient {
  async getMobilityFlowsAtHour(
    hour: string,
    cellId?: number,
    provincia?: string,
    limit: number = 100
  ): Promise<MobilityCellProvinceFlowDto[]> {
    const params = new URLSearchParams({ hour });
    if (cellId !== undefined) params.append('cellId', cellId.toString());
    if (provincia) params.append('provincia', provincia);
    params.append('limit', limit.toString());

    return this.fetch<MobilityCellProvinceFlowDto[]>(`/mobility/flows?${params.toString()}`);
  }

  async getProvinceSummariesAtHour(
    hour: string,
    provincia?: string,
    limit: number = 100
  ): Promise<MobilityProvinceSummaryDto[]> {
    const params = new URLSearchParams({ hour });
    if (provincia) params.append('provincia', provincia);
    params.append('limit', limit.toString());

    return this.fetch<MobilityProvinceSummaryDto[]>(`/mobility/province-summary?${params.toString()}`);
  }
}

export const mobilityApi = new MobilityApiClient()
