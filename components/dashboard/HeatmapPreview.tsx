'use client'

import type { HeatmapCell } from '@/lib/types'
import Link from 'next/link'
import { useEffect, useMemo, useRef } from 'react'
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

interface HeatmapPreviewProps {
  data: HeatmapCell[]
}

export default function HeatmapPreview({ data }: HeatmapPreviewProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<Map | null>(null)
  const heatmapLayerRef = useRef<HeatmapLayer | null>(null)
  
  // Calculate max activity for color scaling
  const maxActivity = useMemo(() => {
    if (!data || data.length === 0) return 1
    return Math.max(...data.map(d => d.totalActivity)) || 1
  }, [data])
  
  // Get top cells for list
  const topCells = useMemo(() => {
    return [...data]
      .sort((a, b) => b.totalActivity - a.totalActivity)
      .slice(0, 5)
  }, [data])

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const baseLayer = new TileLayer({
      source: new OSM(),
    })

    const heatmapLayer = new HeatmapLayer({
      source: new VectorSource(),
      blur: 20,
      radius: 15,
    })

    heatmapLayerRef.current = heatmapLayer

    mapRef.current = new Map({
      target: mapContainerRef.current,
      layers: [baseLayer, heatmapLayer],
      view: new View({
        center: fromLonLat([9.19, 45.4642]), // Milan
        zoom: 11,
        minZoom: 4,
      }),
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined)
        mapRef.current = null
      }
    }
  }, [])

  // Update heatmap data
  useEffect(() => {
    if (!heatmapLayerRef.current || !data || data.length === 0) return

    const source = new VectorSource()
    const features: Feature<Point>[] = []

    for (const cell of data) {
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
  }, [data, maxActivity])

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-200">Network Heatmap</h2>
        <Link 
          href="/dashboard/heatmap"
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          View Full Map →
        </Link>
      </div>

      {/* OpenLayers Map */}
      <div 
        ref={mapContainerRef}
        className="w-full h-96 rounded-lg overflow-hidden bg-slate-900 mb-4"
        style={{ minHeight: '384px' }}
      />

      {/* Top cells list */}
      <div>
        <h3 className="text-sm font-semibold text-slate-400 mb-3">Top Activity Cells</h3>
        <div className="space-y-2">
          {topCells.map((cell) => (
            <div 
              key={cell.cellId}
              className="flex items-center justify-between p-3 bg-slate-900 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-slate-200">Cell {cell.cellId}</p>
                {typeof cell.squareId === 'number' && (
                  <p className="text-xs text-slate-500">Square {cell.squareId}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-blue-400">{cell.totalActivity.toFixed(1)}</p>
                <p className="text-xs text-slate-500">activity</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
