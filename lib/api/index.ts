// Central API export

export { heatmapApi } from './heatmap'
export { cellApi } from './cells'
export { alertsApi } from './alerts'
export { mobilityApi } from './mobility'
export { statsApi } from './stats'
export { provincesApi } from './provinces'

// For backwards compatibility
export const api = {
  heatmap: async (datetime: string) => (await import('./heatmap')).heatmapApi.getHeatmap(datetime),
  topCells: async (hour: string, limit?: number) => (await import('./heatmap')).heatmapApi.getTopCells(hour, limit),
  cellDetails: async (cellId: number) => (await import('./cells')).cellApi.getCellDetails(cellId),
  cellTimeseries: async (cellId: number, from: string, to: string, step?: 'hour' | 'day' | 'minute') => (await import('./cells')).cellApi.getCellTimeseries(cellId, from, to, step),
  alerts: async (since?: string) => (await import('./alerts')).alertsApi.getAlerts(since),
  resolveAlert: async (alertId: string) => (await import('./alerts')).alertsApi.resolveAlert(alertId),
  mobilityFlows: async (hour: string) => (await import('./mobility')).mobilityApi.getMobilityFlowsAtHour(hour),
  networkStats: async () => (await import('./stats')).statsApi.getNetworkStats(),
  streamSlot: async (datetime?: string) => (await import('./stats')).statsApi.streamSlot(datetime),
}
