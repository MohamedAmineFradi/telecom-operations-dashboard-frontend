// Alerts API client

import type { Alert } from '@/lib/types'
import { BaseApiClient } from './base'

export class AlertsApiClient extends BaseApiClient {
  async getAlerts(since?: string): Promise<Alert[]> {
    const query = since ? `?since=${encodeURIComponent(since)}` : ''
    return this.fetch<Alert[]>(`/alerts${query}`)
  }

  async resolveAlert(alertId: string | number): Promise<void> {
    await this.fetch<void>(`/alerts/${alertId.toString()}/resolve`, {
      method: 'POST',
    })
  }
}

export const alertsApi = new AlertsApiClient()
