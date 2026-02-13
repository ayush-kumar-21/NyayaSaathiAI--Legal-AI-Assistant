import React, { useRef, useState, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, useCursor, Line, Sphere, Text, Trail, Stars } from '@react-three/drei';
import { Scan, Shield, Target, Clock, Play, Pause, Rewind, FastForward, User, AlertTriangle, X, Sparkles, Video, Upload, FileVideo, Cpu, CheckCircle2, Map, Crosshair, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
type ViewMode = 'RGB' | 'HEATMAP' | 'INTENSITY';

interface Evidence {
    id: string;
    position: [number, number, number];
    type: 'biological' | 'ballistic' | 'digital' | 'trace';
    label: string;
    description: string;
    analysis: string;
    confidence: number;
    trajectory?: [number, number, number];
    timeAppears: number;
}

interface ActorPath {
    time: number;
    position: [number, number, number];
    rotation: [number, number, number];
    pose: 'standing' | 'walking' | 'aiming' | 'falling' | 'prone';
}

interface Actor {
    id: string;
    role: 'SUSPECT' | 'VICTIM';
    path: ActorPath[];
    color: string;
}

// --- Mock Data ---

const EVIDENCE_DATA: Evidence[] = [
    {
        id: 'E-001',
        position: [-1.2, 0.1, 0.8],
        type: 'ballistic',
        label: '9mm Casing',
        description: 'Ejected casing from Glock 19.',
        analysis: 'Striation Match: Suspect Weapon',
        confidence: 99.5,
        timeAppears: 5.2
    },
    {
        id: 'E-002',
        position: [1.5, 0.05, -0.5],
        type: 'biological',
        label: 'Blood Spatter',
        description: 'High velocity impact spatter.',
        analysis: 'DNA: Victim',
        confidence: 99.9,
        timeAppears: 5.3
    },
    {
        id: 'E-003',
        position: [0.5, 1.5, -2.8],
        type: 'ballistic',
        label: 'Bullet Impact',
        description: 'Bullet lodged in wall plaster.',
        analysis: 'Caliber: 9mm Parabelllum',
        confidence: 95.0,
        trajectory: [2.5, 1.2, -3.5],
        timeAppears: 5.1
    },
];

const ACTORS: Actor[] = [
    {
        id: 'SUSPECT',
        role: 'SUSPECT',
        color: '#ef4444',
        path: [
            { time: 0, position: [-15, 0, 15], rotation: [0, Math.PI / 4, 0], pose: 'walking' },
            { time: 2, position: [-5, 0, 5], rotation: [0, Math.PI / 4, 0], pose: 'walking' },
            { time: 4, position: [-1.5, 0, 1.5], rotation: [0, 0, 0], pose: 'aiming' },
            { time: 5, position: [-1.5, 0, 1.5], rotation: [0, 0, 0], pose: 'aiming' },
            { time: 6, position: [-1.5, 0, 1.5], rotation: [0, Math.PI, 0], pose: 'standing' },
            { time: 8, position: [-15, 0, 20], rotation: [0, Math.PI, 0], pose: 'walking' },
        ]
    },
    {
        id: 'VICTIM',
        role: 'VICTIM',
        color: '#3b82f6',
        path: [
            { time: 0, position: [1, 0, -1], rotation: [0, -Math.PI / 2, 0], pose: 'standing' },
            { time: 3, position: [1.5, 0, -1], rotation: [0, -Math.PI / 2 + 0.2, 0], pose: 'walking' },
            { time: 5, position: [1.5, 0, -1], rotation: [0, -Math.PI / 4, 0], pose: 'standing' },
            { time: 5.5, position: [1.7, 0, -1.2], rotation: [Math.PI / 2, 0, 0], pose: 'falling' },
            { time: 10, position: [1.7, 0, -1.2], rotation: [Math.PI / 2, 0, 0], pose: 'prone' },
        ]
    }
];

// --- Video Processing Components ---
const VideoUploadPanel = ({ onProcessComplete }: { onProcessComplete: () => void }) => {
    const [status, setStatus] = useState<'IDLE' | 'UPLOADING' | 'EXTRACTING' | 'MATCHING' | 'DENSIFYING' | 'SKELETON' | 'COMPLETE'>('IDLE');
    const [progress, setProgress] = useState(0);

    const handleUpload = () => {
        setStatus('UPLOADING');
        setProgress(0);

        setTimeout(() => { setStatus('EXTRACTING'); setProgress(15); }, 1000);
        setTimeout(() => { setStatus('MATCHING'); setProgress(35); }, 2500);
        setTimeout(() => { setStatus('DENSIFYING'); setProgress(60); }, 4500);
        setTimeout(() => { setStatus('SKELETON'); setProgress(85); }, 6500); // New Step
        setTimeout(() => {
            setStatus('COMPLETE');
            setProgress(100);
            setTimeout(onProcessComplete, 1000);
        }, 8500);
    };

    if (status === 'IDLE') {
        return (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
                <div
                    className="border-2 border-dashed border-gray-600 rounded-2xl p-12 flex flex-col items-center gap-4 hover:border-blue-500 hover:bg-blue-500/5 transition-all cursor-pointer group"
                    onClick={handleUpload}
                >
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                        <Upload size={32} className="text-gray-400 group-hover:text-white" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-white">Upload CCTV / Bodycam Footage</h3>
                        <p className="text-gray-400 text-sm mt-1">Drag video file here or click to simulate upload</p>
                    </div>
                    <div className="flex gap-2 mt-4 text-xs text-gray-500 font-mono">
                        <span className="bg-gray-800 px-2 py-1 rounded">.MP4</span>
                        <span className="bg-gray-800 px-2 py-1 rounded">.MOV</span>
                        <span className="bg-gray-800 px-2 py-1 rounded">NeRF COMPATIBLE</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
            <div className="w-96 space-y-6">
                <div className="flex justify-between items-end">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Cpu className={`animate-spin-slow ${status === 'COMPLETE' ? 'text-green-500' : 'text-blue-500'}`} />
                        {status === 'COMPLETE' ? 'RECONSTRUCTION READY' : 'PROCESSING VIDEO'}
                    </h3>
                    <span className="text-xs font-mono text-gray-400">{progress}%</span>
                </div>
                <div className="space-y-3">
                    <StatusStep label="Uploading Evidence" active={status === 'UPLOADING'} completed={progress > 15} />
                    <StatusStep label="Extracting Keyframes" active={status === 'EXTRACTING'} completed={progress > 35} />
                    <StatusStep label="Generating Point Cloud" active={status === 'DENSIFYING'} completed={progress > 60} />
                    <StatusStep label="Identify & Extract Actors (MediaPipe)" active={status === 'SKELETON'} completed={progress > 85} />
                    <StatusStep label="Finalizing Scene" active={status === 'COMPLETE'} completed={status === 'COMPLETE'} />
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>
        </div>
    );
};

const StatusStep = ({ label, active, completed }: { label: string, active: boolean, completed: boolean }) => (
    <div className={`flex items-center gap-3 text-sm transition-colors ${active ? 'text-blue-400' : completed ? 'text-green-500' : 'text-gray-600'}`}>
        {completed ? <CheckCircle2 size={16} /> : <div className={`w-4 h-4 rounded-full border-2 ${active ? 'border-blue-400 border-t-transparent animate-spin' : 'border-gray-700'}`} />}
        <span>{label}</span>
    </div>
);

// --- 3D Components ---

const StructuredLidarRoom = ({ isReconstructed }: { isReconstructed: boolean }) => {
    const pointsData = useMemo(() => {
        const positions: number[] = [];
        const colors: number[] = [];
        const step = isReconstructed ? 0.1 : 0.2;

        const addPoint = (x: number, y: number, z: number, r?: number, g?: number, b?: number) => {
            positions.push(x + (Math.random() - 0.5) * 0.02, y + (Math.random() - 0.5) * 0.02, z + (Math.random() - 0.5) * 0.02);
            if (r !== undefined) {
                colors.push(r, g!, b!);
            } else {
                colors.push(0.3 + Math.random() * 0.1, 0.3 + Math.random() * 0.1, 0.35 + Math.random() * 0.1);
            }
        };

        // --- INTERIOR (The Room) ---
        // Floor
        for (let x = -5; x <= 5; x += step) for (let z = -5; z <= 5; z += step) addPoint(x, 0, z);
        // Walls
        for (let y = 0; y <= 3; y += step) {
            for (let x = -5; x <= 5; x += step) addPoint(x, y, -5); // Back
            for (let z = -5; z <= 5; z += step) { addPoint(-5, y, z); addPoint(5, y, z); }
        }

        // --- EXTERIOR (The Environment) ---
        // Street (Asphalt)
        for (let x = -20; x <= 20; x += 0.4) {
            for (let z = 6; z <= 15; z += 0.4) { // Street in front of room
                addPoint(x, -0.2, z, 0.1, 0.1, 0.12);
            }
        }

        // Sidewalk
        for (let x = -20; x <= 20; x += 0.3) {
            for (let z = 5; z <= 6; z += 0.3) {
                addPoint(x, -0.1, z, 0.6, 0.6, 0.6);
            }
        }

        // Neighboring Buildings (Facades)
        // Left Building
        for (let y = 0; y <= 10; y += 0.5) {
            for (let z = -5; z <= 15; z += 0.5) {
                addPoint(-6, y, z, 0.4, 0.3, 0.2); // Brick color
            }
        }
        // Right Building (Glass)
        for (let y = 0; y <= 12; y += 0.5) {
            for (let z = -5; z <= 15; z += 0.5) {
                addPoint(6, y, z, 0.2, 0.4, 0.5); // Blue glass color
            }
        }

        // Distant City Lights (Random scattered points)
        for (let i = 0; i < 300; i++) {
            addPoint((Math.random() - 0.5) * 70, Math.random() * 15, (Math.random() - 0.5) * 70 - 20, 0.9, 0.8, 0.5);
        }

        return { positions: new Float32Array(positions), colors: new Float32Array(colors) };
    }, [isReconstructed]);

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={pointsData.positions.length / 3} array={pointsData.positions} itemSize={3} />
                <bufferAttribute attach="attributes-color" count={pointsData.colors.length / 3} array={pointsData.colors} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={isReconstructed ? 0.04 : 0.08} vertexColors transparent opacity={0.7} sizeAttenuation={true} depthWrite={false} />
        </points>
    );
};

// Skeleton Component for "Extracted" look
// In a real MediaPipe integration, these would be joints [0..32]
const ActorSkeleton = ({ color }: { color: string }) => {
    return (
        <group>
            {/* Spine */}
            <Line points={[[0, 1, 0], [0, 1.8, 0]]} color={color} lineWidth={2} transparent opacity={0.8} />
            {/* Shoulders */}
            <Line points={[[-0.2, 1.7, 0], [0.2, 1.7, 0]]} color={color} lineWidth={2} transparent opacity={0.8} />
            {/* Arms (Simplified) */}
            <Line points={[[-0.2, 1.7, 0], [-0.4, 1.2, 0.1]] as [number, number, number][]} color={color} lineWidth={2} transparent opacity={0.8} />
            <Line points={[[0.2, 1.7, 0], [0.4, 1.2, 0.1]] as [number, number, number][]} color={color} lineWidth={2} transparent opacity={0.8} />
            {/* Hips */}
            <Line points={[[-0.15, 1, 0], [0.15, 1, 0]] as [number, number, number][]} color={color} lineWidth={2} transparent opacity={0.8} />
            {/* Legs */}
            <Line points={[[-0.15, 1, 0], [-0.2, 0, 0]] as [number, number, number][]} color={color} lineWidth={2} transparent opacity={0.8} />
            <Line points={[[0.15, 1, 0], [0.2, 0, 0]] as [number, number, number][]} color={color} lineWidth={2} transparent opacity={0.8} />

            {/* Joints */}
            <mesh position={[0, 1.8, 0]}><sphereGeometry args={[0.05]} /><meshBasicMaterial color={color} /></mesh>
            <mesh position={[0, 1, 0]}><sphereGeometry args={[0.05]} /><meshBasicMaterial color={color} /></mesh>
        </group>
    );
};


const GhostActor = ({ actor, currentTime }: { actor: Actor, currentTime: number }) => {
    const currentState = useMemo(() => {
        const sortedPath = [...actor.path].sort((a, b) => a.time - b.time);
        if (currentTime <= sortedPath[0].time) return sortedPath[0];
        if (currentTime >= sortedPath[sortedPath.length - 1].time) return sortedPath[sortedPath.length - 1];

        for (let i = 0; i < sortedPath.length - 1; i++) {
            if (currentTime >= sortedPath[i].time && currentTime < sortedPath[i + 1].time) {
                const start = sortedPath[i];
                const end = sortedPath[i + 1];
                const progress = (currentTime - start.time) / (end.time - start.time);
                return {
                    position: [
                        start.position[0] + (end.position[0] - start.position[0]) * progress,
                        start.position[1] + (end.position[1] - start.position[1]) * progress,
                        start.position[2] + (end.position[2] - start.position[2]) * progress
                    ] as [number, number, number],
                    rotation: start.rotation,
                    pose: start.pose
                };
            }
        }
        return sortedPath[0];
    }, [actor, currentTime]);

    return (
        <group position={currentState.position} rotation={currentState.rotation as any}>
            {/* Overlay the Skeleton for "Extraction" visualization */}
            <ActorSkeleton color={actor.color === '#ef4444' ? '#ff8888' : '#88ccff'} />

            {/* Ghost Mesh */}
            <mesh position={[0, 0.9, 0]}>
                <cylinderGeometry args={[0.25, 0.25, 1.8, 8]} />
                <meshBasicMaterial color={actor.color} wireframe transparent opacity={0.15} />
            </mesh>
            <mesh position={[0, 1.9, 0]}>
                <sphereGeometry args={[0.2, 8, 8]} />
                <meshBasicMaterial color={actor.color} wireframe transparent opacity={0.4} />
            </mesh>

            <Html position={[0, 2.3, 0]} center>
                <div className="flex flex-col items-center">
                    <div className="text-[10px] font-bold px-1 rounded bg-black/60 backdrop-blur border border-white/20 whitespace-nowrap flex items-center gap-1" style={{ color: actor.color }}>
                        <Crosshair size={10} /> {actor.role}
                    </div>
                    <div className="text-[8px] text-gray-400 bg-black/80 px-1 mt-0.5 rounded">
                        CONF: 99.2%
                    </div>
                </div>
            </Html>

            <Trail width={0.2} length={10} color={actor.color} attenuation={(t) => t * t}>
                <mesh visible={false}><sphereGeometry args={[0.1]} /><meshBasicMaterial /></mesh>
            </Trail>
        </group>
    );
};

const BulletTrajectory = ({ currentTime }: { currentTime: number }) => {
    if (currentTime < 5.0) return null;
    const start = [-1.5, 1.5, 1.5];
    const end = [0.5, 1.5, -2.8];
    const progress = Math.min(1, (currentTime - 5.0) * 10);
    const currentTip = [
        start[0] + (end[0] - start[0]) * progress,
        start[1] + (end[1] - start[1]) * progress,
        start[2] + (end[2] - start[2]) * progress
    ] as [number, number, number];

    return (
        <group>
            <mesh position={currentTip}><sphereGeometry args={[0.05]} /><meshBasicMaterial color="#ffaa00" toneMapped={false} /></mesh>
            <Line points={[start, currentTip] as [number, number, number][]} color="#ffaa00" lineWidth={2} transparent opacity={0.5} />
        </group>
    );
};

const EvidenceReveal = ({ evidence, currentTime }: { evidence: Evidence, currentTime: number }) => {
    if (currentTime < evidence.timeAppears) return null;
    return (
        <group position={evidence.position}>
            {currentTime < evidence.timeAppears + 0.5 && (
                <mesh><sphereGeometry args={[0.3]} /><meshBasicMaterial color="white" wireframe transparent opacity={1 - (currentTime - evidence.timeAppears) * 2} /></mesh>
            )}
            <mesh position={[0, 0.1, 0]}>
                <coneGeometry args={[0.1, 0.2, 4]} />
                <meshStandardMaterial color={evidence.type === 'ballistic' ? 'red' : 'yellow'} />
            </mesh>
        </group>
    );
};

const TimelineControl = ({ currentTime, setTime, isPlaying, setIsPlaying, totalDuration }: { currentTime: number, setTime: (t: number) => void, isPlaying: boolean, setIsPlaying: (p: boolean) => void, totalDuration: number }) => {
    return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl bg-black/80 backdrop-blur-md border border-gray-800 rounded-xl p-4 flex flex-col gap-3 z-20">
            {/* Header with Source Video PIP */}
            <div className="absolute -top-32 right-4 w-48 h-28 bg-black border border-gray-700 rounded overflow-hidden shadow-2xl hidden md:block group">
                <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
                    {/* Simulated Bodycam effect */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] mix-blend-overlay"></div>
                    <Video size={24} className="text-gray-700" />

                    {/* Skeleton Overlay in Video (Mock) */}
                    <svg className="absolute inset-0 w-full h-full opacity-50 stroke-red-500 stroke-2 fill-none">
                        {/* Mock Skeleton lines synced loosely */}
                        <path d="M100,50 L100,80 M90,60 L110,60" className="animate-pulse" />
                    </svg>

                    <div className="absolute bottom-1 right-1 text-[10px] text-red-500 font-mono animate-pulse flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div> REC
                    </div>
                    <div className="absolute top-1 left-1 text-[8px] text-green-400 font-mono bg-black/50 px-1 rounded">
                        ACTOR_TRACKING_ACTIVE
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center text-gray-400 text-xs font-mono uppercase tracking-wider">
                <span className="flex items-center gap-2"><Clock size={14} className="text-blue-500" /> Video Sync Timeline</span>
                <span>{currentTime.toFixed(2)}s / {totalDuration.toFixed(2)}s</span>
            </div>
            <input
                type="range" min="0" max={totalDuration} step="0.01" value={currentTime}
                onChange={(e) => { setIsPlaying(false); setTime(parseFloat(e.target.value)); }}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
            />
            <div className="flex justify-center items-center gap-6">
                <button onClick={() => setTime(Math.max(0, currentTime - 1))} className="text-gray-400 hover:text-white transition-colors"><Rewind size={20} /></button>
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center text-white transition-all shadow-[0_0_20px_rgba(37,99,235,0.5)]"
                >
                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" ml-1 />}
                </button>
                <button onClick={() => setTime(Math.min(totalDuration, currentTime + 1))} className="text-gray-400 hover:text-white transition-colors"><FastForward size={20} /></button>
            </div>
            <div className="absolute top-[2.8rem] left-4 right-4 h-2 pointer-events-none">
                <div className="absolute w-1 h-3 bg-red-500 -mt-1" style={{ left: `${(5 / totalDuration) * 100}%` }} title="Shot Fired" />
            </div>
        </div>
    );
};

const CrimeScene3DPage = () => {
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasVideo, setHasVideo] = useState(false);
    const totalDuration = 10;

    // Animation Loop
    React.useEffect(() => {
        let animationFrame: number;
        if (isPlaying) {
            const startTime = Date.now() - currentTime * 1000;
            const animate = () => {
                const now = Date.now();
                const newTime = (now - startTime) / 1000;

                if (newTime >= totalDuration) {
                    setCurrentTime(totalDuration);
                    setIsPlaying(false);
                } else {
                    setCurrentTime(newTime);
                    animationFrame = requestAnimationFrame(animate);
                }
            };
            animationFrame = requestAnimationFrame(animate);
        }
        return () => cancelAnimationFrame(animationFrame);
    }, [isPlaying]);


    return (
        <div className="w-full h-[calc(100vh-64px)] bg-[#050505] relative flex flex-col font-sans overflow-hidden">
            {!hasVideo && <VideoUploadPanel onProcessComplete={() => setHasVideo(true)} />}

            <div className="flex-1 relative">
                <Canvas camera={{ position: [0, 8, 15], fov: 60 }}>
                    <color attach="background" args={['#020202']} />
                    <fog attach="fog" args={['#020202', 10, 50]} />
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                    <ambientLight intensity={0.2} />
                    <pointLight position={[5, 10, 5]} intensity={0.5} color="#4455ff" />
                    <group position={[0, -1, 0]}>
                        {hasVideo && (
                            <>
                                <StructuredLidarRoom isReconstructed={true} />
                                <gridHelper args={[60, 60, '#222', '#000']} position={[0, 0.01, 0]} />
                                {ACTORS.map(actor => (
                                    <GhostActor key={actor.id} actor={actor} currentTime={currentTime} />
                                ))}
                                <BulletTrajectory currentTime={currentTime} />
                                {EVIDENCE_DATA.map(ev => (
                                    <EvidenceReveal key={ev.id} evidence={ev} currentTime={currentTime} />
                                ))}
                            </>
                        )}
                    </group>
                    <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.2} />
                </Canvas>

                {hasVideo && (
                    <div className="absolute top-4 left-4 p-4 bg-black/60 backdrop-blur rounded-lg border-l-4 border-blue-500 mt-20 sm:mt-0">
                        <h1 className="text-xl font-bold text-white flex items-center gap-2">
                            <Users className="text-blue-500" /> SKELETON EXTRACTION MODE
                        </h1>
                        <div className="text-gray-400 text-xs mt-1">
                            ACTORS EXTRACTED FROM VIDEO POSE ESTIMATION (MediaPipe)
                        </div>
                    </div>
                )}

                {hasVideo && (
                    <TimelineControl
                        currentTime={currentTime} setTime={setCurrentTime}
                        isPlaying={isPlaying} setIsPlaying={setIsPlaying}
                        totalDuration={totalDuration}
                    />
                )}
            </div>
        </div>
    );
};

export default CrimeScene3DPage;
