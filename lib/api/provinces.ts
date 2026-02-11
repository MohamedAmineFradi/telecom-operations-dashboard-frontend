import { BaseApiClient } from './base'
import type { ProvinceDto } from '../types'

export class ProvincesApiClient extends BaseApiClient {
    async getAllProvinces(): Promise<ProvinceDto[]> {
        return this.fetch<ProvinceDto[]>('/provinces')
    }

    async getProvinceDetails(provincia: string): Promise<ProvinceDto> {
        return this.fetch<ProvinceDto>(`/provinces/${encodeURIComponent(provincia)}`)
    }
}

export const provincesApi = new ProvincesApiClient()
