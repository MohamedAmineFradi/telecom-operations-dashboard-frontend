'use client'

import React, { useMemo, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text, Float, ContactShadows, useTexture, Html, Line, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { SURVEILLANCE_PROVINCES, ProvinceData } from '@/lib/geo/lombardy-provinces';
import { scaleLinear } from 'd3-scale';
import { fromLonLat } from 'ol/proj';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { useProvinces, useGridCells } from '@/lib/hooks';
import { GridCellDto } from '@/lib/types';

interface ProvinceMap3DProps {
    congestionData?: Record<string, number>; // province code -> congestion score (0-100)
    onProvinceClick?: (province: ProvinceData) => void;
    className?: string;
}

function ScanningPulse() {
    const meshRef = useRef<THREE.Mesh>(null);
    useFrame(({ clock }) => {
        if (meshRef.current) {
            const time = clock.getElapsedTime();
            // Upward scanning pulse
            meshRef.current.position.z = (time % 4) * 5 - 2.5;
            const mat = meshRef.current.material as THREE.MeshBasicMaterial;
            mat.opacity = Math.max(0, 0.4 - (time % 4) * 0.1);
        }
    });

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[60, 0.1]} />
            <meshBasicMaterial color="#60a5fa" transparent opacity={0.3} />
        </mesh>
    );
}

// OpenLayers to Three.js scale factor (meters to 3D units)
const GIS_SCALE = 0.0001;

/**
 * Standard Web Mercator Projection (EPSG:3857)
 * Using OpenLayers projection logic for absolute matching
 */
function project(lon: number, lat: number): [number, number] {
    const [x, y] = fromLonLat([lon, lat]);

    // Center around the Lombardy midpoint
    // Roughly [9.5, 45.6] -> [1057535, 5716260]
    const centerX = 1057535;
    const centerY = 5716260;

    return [
        (x - centerX) * GIS_SCALE,
        (y - centerY) * GIS_SCALE
    ];
}

function DataPillar({ position, height, color }: { position: [number, number, number], height: number, color: string }) {
    return (
        <mesh position={[position[0], position[1], position[2] + height / 2]}>
            <cylinderGeometry args={[0.08, 0.08, height, 24]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={2}
                transparent
                opacity={0.8}
                metalness={0.9}
                roughness={0.1}
            />
        </mesh>
    );
}

function FlowLine({ start, end, color }: { start: THREE.Vector3, end: THREE.Vector3, color: string }) {
    const lineRef = useRef<any>(null);
    const mid = start.clone().lerp(end, 0.5);
    mid.z += start.distanceTo(end) * 0.35; // Arc height
    const curve = new THREE.CatmullRomCurve3([start, mid, end]);
    const curvePoints = curve.getPoints(50);

    useFrame(({ clock }) => {
        if (lineRef.current) {
            lineRef.current.material.dashOffset = -clock.getElapsedTime() * 0.8;
        }
    });

    return (
        <group>
            {/* Static thin base line */}
            <Line
                points={curvePoints}
                color={color}
                lineWidth={1}
                transparent
                opacity={0.1}
            />
            {/* Animated data pulse */}
            <Line
                ref={lineRef}
                points={curvePoints}
                color={color}
                lineWidth={1.5}
                dashed
                dashScale={1}
                dashSize={0.5}
                gapSize={1.5}
                transparent
                opacity={0.8}
            />
        </group>
    );
}

function TransitLines({ selectedProvince, provinces }: { selectedProvince: string | null, provinces: ProvinceData[] }) {
    if (!selectedProvince) return null;

    const source = provinces.find(p => p.id === selectedProvince);
    if (!source) return null;

    return (
        <group>
            {provinces.filter(p => p.id !== selectedProvince).map(target => {
                const s = project(source.center[0], source.center[1]);
                const t = project(target.center[0], target.center[1]);

                return (
                    <FlowLine
                        key={target.id}
                        start={new THREE.Vector3(s[0], s[1], 0.2)}
                        end={new THREE.Vector3(t[0], t[1], 0.2)}
                        color="#60a5fa"
                    />
                );
            })}
        </group>
    );
}

/**
 * Live GIS Bridge: Headless OpenLayers to Three.js Texture
 * Renders professional CartoDB Dark Matter tiles for 1:1 GIS parity
 */
function LiveMapBackdrop() {
    const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
    const mapRef = useRef<Map | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        // Create an off-screen container for OpenLayers if it doesn't exist
        let container = document.getElementById('ol-map-source');
        if (!container) {
            container = document.createElement('div');
            container.id = 'ol-map-source';
            container.style.width = '1024px';
            container.style.height = '1024px';
            container.style.position = 'absolute';
            container.style.top = '-10000px';
            container.style.left = '-10000px';
            document.body.appendChild(container);
        }
        containerRef.current = container as HTMLDivElement;

        const map = new Map({
            target: container,
            layers: [
                new TileLayer({
                    source: new XYZ({
                        url: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
                        attributions: '© OpenStreetMap contributors © CARTO',
                        crossOrigin: 'anonymous'
                    })
                })
            ],
            view: new View({
                center: fromLonLat([9.5, 45.62]), // Center of Lombardy
                zoom: 8.4,
                constrainResolution: true
            }),
            controls: []
        });

        mapRef.current = map;

        // Capture loop
        const handlePostRender = () => {
            const canvas = container?.querySelector('canvas');
            if (canvas) {
                if (!texture) {
                    const tex = new THREE.CanvasTexture(canvas);
                    tex.anisotropy = 8;
                    tex.minFilter = THREE.LinearFilter;
                    setTexture(tex);
                } else {
                    texture.needsUpdate = true;
                }
            }
        };

        map.on('postrender', handlePostRender);

        return () => {
            map.un('postrender', handlePostRender);
            map.setTarget(undefined);
            if (container && container.parentNode === document.body) {
                document.body.removeChild(container);
            }
        };
    }, []);

    // The plane size (47.5) is calibrated to the 8.4 zoom level and GIS_SCALE
    const planeSize = 47.5;

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.22, 0]} receiveShadow>
            <planeGeometry args={[planeSize, planeSize]} />
            {texture ? (
                <meshStandardMaterial
                    map={texture}
                    transparent
                    opacity={0.9}
                    roughness={1}
                    metalness={0}
                />
            ) : (
                <meshStandardMaterial color="#020617" />
            )}
        </mesh>
    );
}

function Province({
    data,
    congestion = 0,
    hovered,
    onHover,
    onClick
}: {
    data: ProvinceData;
    congestion: number;
    hovered: boolean;
    onHover: (hovered: boolean) => void;
    onClick: () => void;
}) {
    const meshRef = useRef<THREE.Mesh>(null);

    // Create shape from path
    const shape = useMemo(() => {
        const s = new THREE.Shape();
        const points = data.path.map(p => project(p[0], p[1]));

        s.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
            s.lineTo(points[i][0], points[i][1]);
        }
        s.closePath();
        return s;
    }, [data]);

    // Color based on congestion
    const color = useMemo(() => {
        const scale = scaleLinear<string>()
            .domain([0, 50, 75, 100])
            .range(['#22c55e', '#eab308', '#f97316', '#ef4444']);
        return scale(congestion);
    }, [congestion]);

    // Extrude settings
    const extrudeSettings = useMemo(() => ({
        steps: 1,
        depth: 0.2 + (congestion / 100) * 0.8, // Taller if more congested
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelOffset: 0,
        bevelSegments: 3
    }), [congestion]);

    return (
        <group
            position={[0, 0, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            onPointerOver={(e) => {
                e.stopPropagation();
                onHover(true);
            }}
            onPointerOut={() => onHover(false)}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
        >
            <mesh ref={meshRef} castShadow receiveShadow>
                <extrudeGeometry args={[shape, extrudeSettings]} />
                <meshPhysicalMaterial
                    color={hovered ? '#1e293b' : '#0f172a'} // Deep Obsidian
                    emissive={color}
                    emissiveIntensity={hovered ? 2.5 : 1.2}
                    metalness={0.9}
                    roughness={0.1}
                    transmission={0.6} // Frosted glass effect
                    thickness={0.5}
                    ior={1.5}
                    transparent
                    opacity={0.9}
                />
            </mesh>

            {/* Glowing Pillar for "Statistics" */}
            {(() => {
                const [x, y] = project(data.center[0], data.center[1]);
                return (
                    <DataPillar
                        position={[x, y, extrudeSettings.depth]}
                        height={extrudeSettings.depth * 3} // Exaggerated height for GIS statistics
                        color={color}
                    />
                );
            })()}

            {/* technical Mesh Topology (Edges) */}
            <lineSegments rotation={[0, 0, 0]} position={[0, 0, 0]}>
                <edgesGeometry args={[new THREE.ExtrudeGeometry(shape, extrudeSettings)]} />
                <lineBasicMaterial
                    color={hovered ? "#00f0ff" : "#60a5fa"} // Cyber Cyan
                    transparent
                    opacity={hovered ? 1.0 : 0.4}
                    blending={THREE.AdditiveBlending}
                />
            </lineSegments>

            {/* Label */}
            {(() => {
                const [x, y] = project(data.center[0], data.center[1]);
                return (
                    <>
                        <Billboard
                            position={[x, y, extrudeSettings.depth + 0.2]}
                            follow={true}
                        >
                            <Text
                                fontSize={0.22}
                                color={hovered ? "#ffffff" : "#60a5fa"}
                                anchorX="center"
                                anchorY="middle"
                                font="https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxM.woff" // Technical font
                            >
                                {data.code}
                            </Text>
                        </Billboard>

                        {/* 3D Billboard Tooltip */}
                        {hovered && (
                            <Html
                                position={[x, y, extrudeSettings.depth + 0.5]}
                                center
                                distanceFactor={10}
                            >
                                <div className="bg-white/90 backdrop-blur-xl border border-slate-200 p-3 rounded-xl shadow-2xl pointer-events-none min-w-[120px] animate-in zoom-in duration-300">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{data.name}</p>
                                    <div className="mt-1 flex items-baseline space-x-2">
                                        <span className="text-xl font-black text-slate-900">{congestion.toFixed(0)}%</span>
                                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Load</span>
                                    </div>
                                </div>
                            </Html>
                        )}
                    </>
                );
            })()}
        </group>
    );
}

export default function ProvinceMap3D({ congestionData = {}, onProvinceClick, className = "" }: ProvinceMap3DProps) {
    const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
    const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);
    const { data: provincesBackend } = useProvinces();
    const { data: gridCells } = useGridCells();

    // Map backend data to province codes for easy lookup
    const provinceMetrics = useMemo(() => {
        const mapping: Record<string, { population?: number }> = {};
        provincesBackend?.forEach(p => {
            // Match by name or code if possible. Backend used 'provincia'
            const staticProv = SURVEILLANCE_PROVINCES.find(sp => sp.name.toLowerCase() === p.provincia.toLowerCase() || sp.code === p.provincia);
            if (staticProv) {
                mapping[staticProv.id] = { population: p.population };
            }
        });
        return mapping;
    }, [provincesBackend]);

    // Offset for coordinates to center around Milano
    const OFFSET = [9.2, 45.5];
    const MULTIPLIER = 10;

    return (
        <div className={`relative w-full h-full min-h-[400px] ${className}`}>
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 8, 12]} fov={40} />
                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    maxPolarAngle={Math.PI / 2.2}
                    minDistance={5}
                    maxDistance={25}
                />

                {/* Advanced GIS Connectivity */}
                <TransitLines selectedProvince={selectedProvinceId} provinces={SURVEILLANCE_PROVINCES} />

                {/* Lights */}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
                <directionalLight position={[-5, 10, 5]} intensity={0.8} castShadow />

                {/* Ground/Shadow plane and Grid */}
                <gridHelper args={[100, 100, '#e2e8f0', '#f1f5f9']} position={[0, -0.19, 0]} />
                <ContactShadows
                    position={[0, -0.1, 0]}
                    opacity={0.2}
                    scale={20}
                    blur={2}
                    far={4.5}
                />

                {/* Map Elements */}
                {SURVEILLANCE_PROVINCES.map((province: ProvinceData) => (
                    <Province
                        key={province.id}
                        data={province}
                        congestion={congestionData[province.code] || 45} // Default if none
                        hovered={hoveredProvince === province.id}
                        onHover={(h) => setHoveredProvince(h ? province.id : null)}
                        onClick={() => {
                            setSelectedProvinceId(province.id === selectedProvinceId ? null : province.id);
                            onProvinceClick?.(province);
                        }}
                    />
                ))}

                {/* Milano Cell Grid Layer (only visible for Milano) */}
                {gridCells && gridCells.length > 0 && (
                    <group>
                        {gridCells.slice(0, 500).map((cell: any) => {
                            // Only show if it's Milano area roughly
                            const isInMilano = cell.centroidX > 9.0 && cell.centroidX < 9.4 && cell.centroidY > 45.3 && cell.centroidY < 45.6;
                            if (!isInMilano) return null;

                            const isVisible = hoveredProvince === 'MI';

                            return (
                                <mesh
                                    key={cell.cellId}
                                    position={[
                                        (cell.centroidX - OFFSET[0]) * MULTIPLIER,
                                        (cell.centroidY - OFFSET[1]) * MULTIPLIER,
                                        isVisible ? 0.5 : -0.5
                                    ]}
                                    rotation={[-Math.PI / 2, 0, 0]}
                                >
                                    <boxGeometry args={[0.02, 0.02, 0.1]} />
                                    <meshStandardMaterial
                                        color={isVisible ? "#3b82f6" : "#1e40af"}
                                        emissive="#3b82f6"
                                        emissiveIntensity={isVisible ? 1 : 0}
                                        transparent
                                        opacity={isVisible ? 0.8 : 0}
                                    />
                                </mesh>
                            );
                        })}
                    </group>
                )}

                {/* Dynamic Background (Italy Map Context) */}
                <ScanningPulse />
                <LiveMapBackdrop />

                {/* Deep Surveillance Background */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]} receiveShadow>
                    <planeGeometry args={[1000, 1000]} />
                    <meshStandardMaterial color="#020617" roughness={1} metalness={0} />
                </mesh>
            </Canvas>

            {/* Hover Tooltip Overlay */}
            {hoveredProvince && (
                <div className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl pointer-events-none transform transition-all animate-in fade-in slide-in-from-top-2">
                    <h3 className="text-lg font-black text-white">{SURVEILLANCE_PROVINCES.find((p: ProvinceData) => p.id === hoveredProvince)?.name}</h3>
                    <div className="mt-2 space-y-1">
                        <div className="flex justify-between items-center space-x-4">
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Congestion</span>
                            <span className="text-sm font-black text-blue-400">
                                {(congestionData[hoveredProvince] || 45).toFixed(1)}%
                            </span>
                        </div>
                        {provinceMetrics[hoveredProvince]?.population && (
                            <div className="flex justify-between items-center space-x-4">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Population</span>
                                <span className="text-sm font-black text-slate-200">
                                    {provinceMetrics[hoveredProvince].population?.toLocaleString()}
                                </span>
                            </div>
                        )}
                        <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                                style={{ width: `${congestionData[hoveredProvince] || 45}%` }}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="absolute bottom-4 left-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/5">
                Interprovincial Mesh v1.0 • 3D Real-time
            </div>
        </div>
    );
}
