import { useState, useEffect } from 'react'

export interface TimeSeriesData {
  timestamp: string
  value: number
  label?: string
}

export interface UseTimeSeriesOptions {
  startDate?: Date
  endDate?: Date
  interval?: 'hour' | 'day' | 'week' | 'month'
  autoRefresh?: boolean
  refreshInterval?: number
}

/**
 * Hook for managing time series data
 * Useful for trend analysis and historical data
 */
export function useTimeSeries(
  fetchData: (start: Date, end: Date) => Promise<TimeSeriesData[]>,
  options: UseTimeSeriesOptions = {}
) {
  const {
    startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    endDate = new Date(),
    autoRefresh = false,
    refreshInterval = 60000 // 1 minute
  } = options

  const [data, setData] = useState<TimeSeriesData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [dateRange, setDateRange] = useState({ start: startDate, end: endDate })

  useEffect(() => {
    let isMounted = true
    let timeoutId: NodeJS.Timeout

    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await fetchData(dateRange.start, dateRange.end)
        
        if (isMounted) {
          setData(result)
          setLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error)
          setLoading(false)
        }
      }
    }

    loadData()

    if (autoRefresh) {
      timeoutId = setInterval(loadData, refreshInterval)
    }

    return () => {
      isMounted = false
      if (timeoutId) {
        clearInterval(timeoutId)
      }
    }
  }, [dateRange, autoRefresh, refreshInterval])

  const updateDateRange = (start: Date, end: Date) => {
    setDateRange({ start, end })
  }

  const refresh = async () => {
    setLoading(true)
    try {
      const result = await fetchData(dateRange.start, dateRange.end)
      setData(result)
      setError(null)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return {
    data,
    loading,
    error,
    dateRange,
    updateDateRange,
    refresh
  }
}

/**
 * Hook for comparing data across different time periods
 */
export function useComparison(
  fetchData: (start: Date, end: Date) => Promise<number>,
  baseStart: Date,
  baseEnd: Date,
  compareStart: Date,
  compareEnd: Date
) {
  const [baseValue, setBaseValue] = useState<number | null>(null)
  const [compareValue, setCompareValue] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadComparison = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [base, compare] = await Promise.all([
          fetchData(baseStart, baseEnd),
          fetchData(compareStart, compareEnd)
        ])
        
        if (isMounted) {
          setBaseValue(base)
          setCompareValue(compare)
          setLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error)
          setLoading(false)
        }
      }
    }

    loadComparison()

    return () => {
      isMounted = false
    }
  }, [baseStart, baseEnd, compareStart, compareEnd])

  const difference = baseValue !== null && compareValue !== null
    ? baseValue - compareValue
    : null

  const percentageChange = baseValue !== null && compareValue !== null && compareValue !== 0
    ? ((baseValue - compareValue) / compareValue) * 100
    : null

  return {
    baseValue,
    compareValue,
    difference,
    percentageChange,
    loading,
    error
  }
}

/**
 * Generate mock time series data for development
 */
export function generateMockTimeSeries(
  days: number,
  baseValue: number = 50,
  variance: number = 20
): TimeSeriesData[] {
  const data: TimeSeriesData[] = []
  const now = Date.now()
  
  for (let i = days - 1; i >= 0; i--) {
    const timestamp = new Date(now - i * 24 * 60 * 60 * 1000).toISOString()
    const value = baseValue + (Math.random() - 0.5) * variance
    data.push({ timestamp, value: Math.max(0, value) })
  }
  
  return data
}
