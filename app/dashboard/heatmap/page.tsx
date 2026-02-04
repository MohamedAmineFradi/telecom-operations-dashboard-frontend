'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useEffect, useMemo, useRef, useState } from 'react'
import { DEFAULT_HOUR_ISO } from '@/lib/time'
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import HeatmapLayer from 'ol/layer/Heatmap'
import VectorSource from 'ol/source/Vector'
import OSM from 'ol/source/OSM'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { fromLonLat } from 'ol/proj'

export default function HeatmapPage() {
  const [timestamp, setTimestamp] = useState(DEFAULT_HOUR_ISO)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<Map | null>(null)
  const heatmapLayerRef = useRef<HeatmapLayer | null>(null)
  const [hasCoordinates, setHasCoordinates] = useState(true)

  const { data: heatmap, isLoading } = useQuery({
    queryKey: ['heatmap', timestamp],
    queryFn: () => api.getHeatmap(timestamp)
  })

  const maxActivity = useMemo(() => {
    if (!heatmap || heatmap.length === 0) return 1
    return Math.max(...heatmap.map((cell) => cell.totalActivity)) || 1
  }, [heatmap])

  useEffect(() => {
    if (isLoading || !mapContainerRef.current) {
      return
    }

    if (!mapRef.current) {
      const baseLayer = new TileLayer({
        source: new OSM(),
      })

      const heatmapLayer = new HeatmapLayer({
        source: new VectorSource(),
        blur: 24,
        radius: 18,
      })

      heatmapLayerRef.current = heatmapLayer

      mapRef.current = new Map({
        target: mapContainerRef.current,
        layers: [baseLayer, heatmapLayer],
        view: new View({
          center: fromLonLat([9.19, 45.4642]),
          zoom: 11,
          minZoom: 4,
        }),
      })
    }
  }, [isLoading])

  useEffect(() => {
    if (!heatmapLayerRef.current) return

    const source = new VectorSource()
    const features: Feature<Point>[] = []

    for (const cell of heatmap || []) {
      const longitude = typeof cell.longitude === 'number' ? cell.longitude : cell.lon
      const latitude = typeof cell.latitude === 'number' ? cell.latitude : cell.lat

      if (typeof longitude !== 'number' || typeof latitude !== 'number') {
        continue
      }

      const feature = new Feature({
        geometry: new Point(fromLonLat([longitude, latitude])),
        weight: Math.min(1, cell.totalActivity / maxActivity),
      })
      features.push(feature)
    }

    source.addFeatures(features)
    heatmapLayerRef.current.setSource(source)
    setHasCoordinates(features.length > 0)
  }, [heatmap, maxActivity])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Network Heatmap</h1>
          <p className="text-slate-400 mt-2">Spatial visualization of network activity</p>
        </div>
        
        <div className="flex space-x-4">
          <input
            type="datetime-local"
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200"
            onChange={(e) => {
              const value = e.target.value
              setTimestamp(value ? new Date(value).toISOString() : '')
            }}
          />
        </div>
      </div>

      {/* Heatmap container */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="relative h-[600px] bg-slate-900 rounded-lg overflow-hidden">
            <div ref={mapContainerRef} className="absolute inset-0" />
            {!hasCoordinates && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/70">
                <p className="text-slate-400">
                  No coordinates available for geospatial rendering.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Traffic Legend</h3>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-slate-400">Low</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm text-slate-400">Medium</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-sm text-slate-400">High</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-slate-400">Critical</span>
          </div>
        </div>
      </div>
    </div>
  )
}
