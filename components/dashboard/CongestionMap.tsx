import React, { useEffect, useRef, useState, useMemo } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { CongestionCellDto } from '@/lib/types';

interface CongestionMapProps {
    congestionCells: CongestionCellDto[];
    warnThreshold: number;
    critThreshold: number;
    onCellClick?: (cellId: number) => void;
    className?: string;
}

// EPSG:4326 (WGS84) coordinates for Lombardy center
const LOMBARDY_CENTER = [9.5, 45.6];

function getColorForScore(score: number, warnThreshold: number, critThreshold: number): string {
    if (score >= critThreshold) {
        return '#ef4444'; // red
    } else if (score >= warnThreshold) {
        return '#eab308'; // yellow
    } else {
        return '#22c55e'; // green
    }
}

function getSeverityLabel(score: number, warnThreshold: number, critThreshold: number): string {
    if (score >= critThreshold) {
        return 'CRITICAL';
    } else if (score >= warnThreshold) {
        return 'WARNING';
    } else {
        return 'NORMAL';
    }
}

// Mock cell geolocation function - maps cellId to coordinates within Lombardy
function getCellCoordinates(cellId: number): [number, number] {
    const seed = cellId * 12345;
    const lat = 45.2 + ((seed % 1000) / 1000) * 1.0;
    const lon = 9.0 + (((seed * 7) % 1000) / 1000) * 1.0;
    return [lon, lat];
}

export default function CongestionMap({
    congestionCells = [],
    warnThreshold,
    critThreshold,
    onCellClick,
    className = ''
}: CongestionMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<Map | null>(null);
    const vectorSourceRef = useRef<VectorSource>(new VectorSource());
    const [selectedCell, setSelectedCell] = useState<number | null>(null);

    // Create features from congestion cells
    const features = useMemo(() => {
        return (congestionCells || []).map(cell => {
            const [lon, lat] = getCellCoordinates(cell.cellId);
            const feature = new Feature({
                geometry: new Point(fromLonLat([lon, lat])),
                cellId: cell.cellId,
                score: cell.score,
                activity: cell.totalActivity,
                severity: cell.severity,
            });
            return feature;
        });
    }, [congestionCells]);

    // Initialize map
    useEffect(() => {
        if (!mapContainer.current) return;

        const vectorLayer = new VectorLayer({
            source: vectorSourceRef.current,
            style: function (feature) {
                const score = feature.get('score');
                const color = getColorForScore(score, warnThreshold, critThreshold);
                const isSelected = feature.get('cellId') === selectedCell;
                const radius = isSelected ? 12 : 8;
                const opacity = isSelected ? 1 : 0.7;

                return new Style({
                    image: new CircleStyle({
                        radius: radius,
                        fill: new Fill({
                            color: color,
                        }),
                        stroke: new Stroke({
                            color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.3)',
                            width: isSelected ? 3 : 1,
                        }),
                    }),
                });
            },
        });

        const tileLayer = new TileLayer({
            source: new XYZ({
                url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                attributions: 'OSM',
            }),
        });

        const map = new Map({
            target: mapContainer.current,
            layers: [tileLayer, vectorLayer],
            view: new View({
                center: fromLonLat(LOMBARDY_CENTER),
                zoom: 10,
            }),
        });

        // Handle click on features
        map.on('click', function (evt) {
            let clickedFeature: Feature | null = null;
            map.forEachFeatureAtPixel(evt.pixel, (feature: any) => {
                clickedFeature = feature;
                return true;
            });

            if (clickedFeature) {
                const cellId = (clickedFeature as any).get('cellId');
                setSelectedCell(cellId);
                onCellClick?.(cellId);
            }
        });

        // Change cursor on hover
        map.on('pointermove', function (e) {
            const pixel = map.getEventPixel(e.originalEvent);
            const hit = map.hasFeatureAtPixel(pixel);
            const target = map.getTarget();
            if (target && typeof target !== 'string') {
                target.style.cursor = hit ? 'pointer' : '';
            }
        });

        mapRef.current = map;

        return () => {
            map.dispose();
        };
    }, [selectedCell, warnThreshold, critThreshold, onCellClick]);

    // Update features
    useEffect(() => {
        vectorSourceRef.current.clear();
        vectorSourceRef.current.addFeatures(features);
    }, [features]);

    const stats = useMemo(() => {
        if (!congestionCells || congestionCells.length === 0) return { critical: 0, warning: 0, normal: 0 };

        let critical = 0, warning = 0, normal = 0;
        congestionCells.forEach(cell => {
            if (cell.score >= critThreshold) critical++;
            else if (cell.score >= warnThreshold) warning++;
            else normal++;
        });
        return { critical, warning, normal };
    }, [congestionCells, warnThreshold, critThreshold]);

    const selectedCellData = congestionCells.find(c => c.cellId === selectedCell);

    return (
        <div className={`relative w-full h-full flex flex-col bg-slate-950 rounded-3xl overflow-hidden ${className}`}>
            {/* Map Container */}
            <div
                ref={mapContainer}
                className="flex-1 w-full relative"
                style={{ minHeight: '500px' }}
            />

            {/* Legend & Controls */}
            <div className="absolute bottom-6 left-6 z-10 space-y-4">
                {/* Legend */}
                <div className="bg-slate-950/80 backdrop-blur-lg border border-white/10 rounded-2xl p-4 space-y-3">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.15em]">Congestion Status</h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-xs text-slate-300 font-bold">Normal (&lt; {warnThreshold}%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <span className="text-xs text-slate-300 font-bold">Warning ({warnThreshold}%-{critThreshold}%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-xs text-slate-300 font-bold">Critical (&gt; {critThreshold}%)</span>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="bg-slate-950/80 backdrop-blur-lg border border-white/10 rounded-2xl p-4 space-y-2 min-w-max">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.15em]">Network Overview</h3>
                    <div className="text-xs space-y-1">
                        <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Total Cells:</span>
                            <span className="font-bold text-white">{congestionCells.length}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-red-400">Critical:</span>
                            <span className="font-bold text-red-500">{stats.critical}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-yellow-400">Warning:</span>
                            <span className="font-bold text-yellow-500">{stats.warning}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-green-400">Normal:</span>
                            <span className="font-bold text-green-500">{stats.normal}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Selected Cell Info */}
            {selectedCellData && (
                <div className="absolute top-6 right-6 z-10 bg-slate-950/80 backdrop-blur-lg border border-white/10 rounded-2xl p-6 max-w-sm">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.15em]">Selected Cell</h3>
                            <p className="text-lg font-black text-white mt-1">Terminal Node {selectedCellData.cellId}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                            <div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">NCI Score</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className={`w-2 h-2 rounded-full ${selectedCellData.score >= critThreshold ? 'bg-red-500' :
                                        selectedCellData.score >= warnThreshold ? 'bg-yellow-500' : 'bg-green-500'
                                        }`}></div>
                                    <span className="text-lg font-black text-white">{selectedCellData.score.toFixed(1)}%</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Status</span>
                                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                    selectedCellData.score >= critThreshold ? 'bg-red-500/20 text-red-300' :
                                    selectedCellData.score >= warnThreshold ? 'bg-yellow-500/20 text-yellow-300' :
                                    'bg-green-500/20 text-green-300'
                                }`}>
                                    {getSeverityLabel(selectedCellData.score, warnThreshold, critThreshold)}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-white/5 pt-4">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Activity</span>
                            <p className="text-sm font-black text-slate-200 mt-1">{selectedCellData.totalActivity.toFixed(2)} Mbps</p>
                        </div>

                        <button
                            onClick={() => setSelectedCell(null)}
                            className="w-full mt-4 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg text-xs font-bold uppercase transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Map Attribution */}
            <div className="absolute bottom-2 right-2 text-[10px] text-slate-500 z-0 pointer-events-none">
                © OpenStreetMap contributors
            </div>
        </div>
    );
}
