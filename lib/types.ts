// DTOs for telecom dashboard based on backend definitions

export type UserRole = 'director' | 'network_engineer' | 'sys_admin' | 'network_operator' | 'performance_engineer' | 'operations_manager';

export interface AlertDto {
  id: number;
  cellId: number;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
}

// Keep Alert for backward compatibility if needed, but using AlertDto now
export interface Alert extends AlertDto {
  squareId?: number;
  resolved: boolean;
}

export interface GridCellDto {
  cellId: number;
  bounds: string;
  centroidX: number;
  centroidY: number;
}

export interface ProvinceDto {
  provincia: string;
  population: number;
}

export interface CellDetailsDto {
  cellId: number;
  countrycode: number;
  lastSeen: string;
  smsIn: number;
  smsOut: number;
  callIn: number;
  callOut: number;
  internet: number;
  totalActivity: number;
  bounds: string;
  centroidX: number;
  centroidY: number;
}

export interface CellTimeseriesPointDto {
  datetime: string;
  sms: number;
  voice: number;
  data: number;
}

export interface CongestionCellDto {
  cellId: number;
  totalActivity: number;
  score: number;
  severity: string;
}

export interface HeatmapCellDto {
  cellId: number;
  totalSmsin: number;
  totalSmsout: number;
  totalCallin: number;
  totalCallout: number;
  totalInternet: number;
  totalActivity: number;
  bounds?: string;
  lon?: number;
  lat?: number;
  // compatible fields
  longitude?: number;
  latitude?: number;
}

// For backward compatibility
export type HeatmapCell = HeatmapCellDto;

export interface HourlyCellDto {
  cellId: number;
  totalSmsin: number;
  totalSmsout: number;
  totalCallin: number;
  totalCallout: number;
  totalInternet: number;
  totalActivity: number;
}

export interface HourlyTrafficSummaryDto {
  hour: string;
  totalSmsin: number;
  totalSmsout: number;
  totalCallin: number;
  totalCallout: number;
  totalInternet: number;
  totalActivity: number;
}

export interface MobilityCellProvinceFlowDto {
  cellId: number;
  provincia: string;
  cellToProvince: number;
  provinceToCell: number;
  totalFlow: number;
}

export interface MobilityFlowDto {
  fromCellId: number;
  toCellId: number;
  volume: number;
}

export interface MobilityProvinceSummaryDto {
  provincia: string;
  totalCellToProvince: number;
  totalProvinceToCell: number;
  totalFlow: number;
}

export interface NetworkStatsDto {
  totalAlerts: number;
  totalCells: number;
  totalTrafficRecords: number;
  latestTrafficAt: string | null;
}

export interface StreamSlotResultDto {
  slotDatetime: string;
  sentEvents: number;
}

export interface StreamStatusDto {
  currentSlot: string;
  lastSentAt: string;
  eventsPerSlot: number;
}

export interface TopCellDto {
  cellId: number;
  totalSmsin: number;
  totalSmsout: number;
  totalCallin: number;
  totalCallout: number;
  totalInternet: number;
  totalActivity: number;
}

export interface TrafficEvent {
  datetime: string;
  cellId: number;
  totalActivity: number;
  totalSmsin: number;
  totalSmsout: number;
  totalCallin: number;
  totalCallout: number;
  totalInternet: number;
}

// Legacy types support
export interface TimeSeriesData {
  timestamp: string;
  value: number;
  metric: string;
}

export interface CellDetails extends CellDetailsDto {
  squareId?: number;
  currentLoad?: number;
  averageLoad?: number;
  alerts?: Alert[];
  timeseries?: TimeSeriesData[];
}

export interface MobilityFlow extends MobilityFlowDto {
  flow: number; // for legacy
}

export interface NetworkStats extends NetworkStatsDto {
  latestDatetime: string | null; // for legacy
}
