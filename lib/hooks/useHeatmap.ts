'use client'

import { useQuery } from '@tanstack/react-query';
import type { HeatmapCellDto, TopCellDto, HourlyCellDto } from '@/lib/types'
import { heatmapApi } from '@/lib/api/heatmap';

export function useHeatmap(datetime: string) {
  return useQuery({
    queryKey: ['heatmap', datetime],
    queryFn: () => heatmapApi.getHeatmap(datetime),
    enabled: !!datetime,
    staleTime: 1000 * 60 * 5,
  });
}

export function useTopCells(datetime: string, limit = 10) {
  return useQuery({
    queryKey: ['topCells', datetime, limit],
    queryFn: () => heatmapApi.getTopCells(datetime, limit),
    enabled: !!datetime,
    staleTime: 1000 * 60 * 5,
  });
}

export function useHourlyTraffic(hour: string) {
  return useQuery({
    queryKey: ['hourlyTraffic', hour],
    queryFn: () => heatmapApi.getAllCellsAtHour(hour),
    enabled: !!hour,
    staleTime: 1000 * 60 * 5,
  });
}
