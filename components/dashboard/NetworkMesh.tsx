'use client'

import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Line, Sphere, Points } from '@react-three/drei';
import * as THREE from 'three';
import { CongestionCellDto } from '@/lib/types';

interface NetworkMeshProps {
    congestionCells: CongestionCellDto[];
    warnThreshold: number;
    critThreshold: number;
    className?: string;
}

// Mock cell positions based on cellId
function getCellPosition(cellId: number): THREE.Vector3 {
    const seed = cellId * 12345;
    const x = ((seed % 1000) / 1000) * 20 - 10;
    const y = (((seed * 7) % 1000) / 1000) * 20 - 10;
    const z = (((seed * 13) % 1000) / 1000) * 10 - 5;
    return new THREE.Vector3(x, y, z);
}

function getColorForScore(score: number, warnThreshold: number, critThreshold: number): THREE.Color {
    if (score >= critThreshold) {
        return new THREE.Color(0xef4444); // red
    } else if (score >= warnThreshold) {
        return new THREE.Color(0xeab308); // yellow
    } else {
        return new THREE.Color(0x22c55e); // green
    }
}

interface CellNodeProps {
    cellId: number;
    score: number;
    activity: number;
    warnThreshold: number;
    critThreshold: number;
}

function CellNode({ cellId, score, activity, warnThreshold, critThreshold }: CellNodeProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const position = getCellPosition(cellId);
    const color = getColorForScore(score, warnThreshold, critThreshold);
    const radius = 0.3 + (score / 100) * 0.4;

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.position.z += Math.sin(clock.getElapsedTime() * 2) * 0.01;
        }
    });

    return (
        <mesh ref={meshRef} position={[position.x, position.y, position.z]}>
            <sphereGeometry args={[radius, 32, 32]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.5}
                metalness={0.8}
                roughness={0.2}
            />
        </mesh>
    );
}

interface ConnectionLineProps {
    cellId1: number;
    cellId2: number;
    intensity: number;
}

function ConnectionLine({ cellId1, cellId2, intensity }: ConnectionLineProps) {
    const pos1 = getCellPosition(cellId1);
    const pos2 = getCellPosition(cellId2);

    return (
        <Line
            points={[
                [pos1.x, pos1.y, pos1.z],
                [pos2.x, pos2.y, pos2.z],
            ]}
            color={new THREE.Color().lerpColors(
                new THREE.Color(0x22c55e),
                new THREE.Color(0xef4444),
                intensity
            )}
            lineWidth={1 + intensity * 2}
            transparent
            opacity={0.6}
        />
    );
}

export default function NetworkMesh({
    congestionCells = [],
    warnThreshold,
    critThreshold,
    className = ''
}: NetworkMeshProps) {
    // Generate connections between nearby congested cells
    const connections = React.useMemo(() => {
        const conns: Array<{ cellId1: number; cellId2: number; intensity: number }> = [];

        for (let i = 0; i < Math.min(congestionCells.length, 20); i++) {
            for (let j = i + 1; j < Math.min(congestionCells.length, 20); j++) {
                const dist = Math.abs(
                    getCellPosition(congestionCells[i].cellId).distanceTo(
                        getCellPosition(congestionCells[j].cellId)
                    )
                );

                // Only connect nearby cells
                if (dist < 15) {
                    const intensity = Math.max(
                        congestionCells[i].score,
                        congestionCells[j].score
                    ) / 100;
                    conns.push({
                        cellId1: congestionCells[i].cellId,
                        cellId2: congestionCells[j].cellId,
                        intensity,
                    });
                }
            }
        }

        return conns.slice(0, 50); // Limit connections for performance
    }, [congestionCells]);

    return (
        <div className={`w-full h-full relative bg-slate-950 rounded-3xl overflow-hidden ${className}`}>
            <Canvas
                camera={{ position: [0, 0, 30], fov: 75 }}
                className="w-full h-full"
            >
                <PerspectiveCamera makeDefault position={[0, 0, 30]} />
                <OrbitControls
                    enableDamping
                    dampingFactor={0.05}
                    autoRotate
                    autoRotateSpeed={2}
                />

                {/* Lighting */}
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, 10]} intensity={0.5} color={0x60a5fa} />

                {/* Grid */}
                <gridHelper args={[40, 40]} position={[0, 0, -5]} />

                {/* Connections */}
                {connections.map((conn, idx) => (
                    <ConnectionLine
                        key={idx}
                        cellId1={conn.cellId1}
                        cellId2={conn.cellId2}
                        intensity={conn.intensity}
                    />
                ))}

                {/* Nodes */}
                {congestionCells.slice(0, 50).map((cell) => (
                    <CellNode
                        key={cell.cellId}
                        cellId={cell.cellId}
                        score={cell.score}
                        activity={cell.totalActivity}
                        warnThreshold={warnThreshold}
                        critThreshold={critThreshold}
                    />
                ))}
            </Canvas>

            {/* Legend Overlay */}
            <div className="absolute top-4 left-4 z-10 bg-slate-950/80 backdrop-blur-lg border border-white/10 rounded-2xl p-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] mb-3">Network Topology</h3>
                <div className="space-y-2 text-[10px]">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-slate-300">Normal Cells</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                        <span className="text-slate-300">Warning</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span className="text-slate-300">Critical</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
