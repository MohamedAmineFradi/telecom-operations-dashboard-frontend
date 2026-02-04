// DTOs for telecom dashboard

export interface HeatmapCell {
  cellId: number
  totalActivity: number
  squareId?: number
  latitude?: number
  longitude?: number
  lat?: number
  lon?: number
  smsIn?: number
  smsOut?: number
  callIn?: number
  callOut?: number
  internetTraffic?: number
  timestamp?: string
}

export interface TopCellDto {
  cellId: number
  totalActivity: number
  hour: string
}

export interface Alert {
  id: string
  cellId: number
  squareId: number
  type: 'anomaly' | 'overload' | 'outage'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  timestamp: string
  resolved: boolean
}

export interface TimeSeriesData {
  timestamp: string
  value: number
  metric: string
}

export interface CellDetails {
  cellId: number
  squareId: number
  latitude: number
  longitude: number
  currentLoad: number
  averageLoad: number
  alerts: Alert[]
  timeseries: TimeSeriesData[]
}

export interface MobilityFlow {
  fromCellId: number
  toCellId: number
  flow: number
  timestamp: string
}

export interface NetworkStats {
  totalAlerts: number
  totalCells: number
  totalTrafficRecords: number
  latestDatetime: string | null
}
