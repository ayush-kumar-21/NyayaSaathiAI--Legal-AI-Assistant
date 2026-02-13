import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Layers,
    MoreVertical,
    Plus,
    MapPin,
    Camera,
    Info
} from 'lucide-react';
import crimeService from '../../../core/services/crimeService';
import { CrimeScene, EvidenceMarker, EvidenceMarkerType } from '../../../core/types/crime3d';

// A simple mock 3D viewer component since we don't have Three.js setup yet
const Mock3DViewer: React.FC<{ markers: EvidenceMarker[], onAddMarker: (x: number, y: number) => void }> = ({ markers, onAddMarker }) => {
    return (
        <div
            className="relative w-full h-[500px] bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden cursor-crosshair group"
            onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                onAddMarker(x, y);
            }}
        >
            {/* Grid Lines to simulate 3D space */}
            <div className="absolute inset-x-0 top-1/2 border-t border-neutral-700/50 transform -skew-x-12"></div>
            <div className="absolute inset-y-0 left-1/2 border-l border-neutral-700/50 transform -skew-y-6"></div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-neutral-600 font-bold text-2xl opacity-20">3D SCENE RECONSTRUCTION VIEW</p>
            </div>

            {markers.map((marker, idx) => (
                <div
                    key={marker.id}
                    className="absolute w-8 h-8 -ml-4 -mt-4 flex items-center justify-center bg-red-500/80 rounded-full border-2 border-white shadow-lg shadow-red-900/50 hover:scale-125 transition-transform cursor-pointer"
                    style={{
                        left: `${(marker.position_x + 2) / 4 * 100}%`, // Mock projection
                        top: `${(marker.position_z + 2) / 4 * 100}%`
                    }}
                    title={`${marker.type}: ${marker.description}`}
                >
                    <span className="text-xs font-bold text-white">{idx + 1}</span>
                </div>
            ))}

            <div className="absolute bottom-4 right-4 bg-black/60 px-3 py-1.5 rounded text-xs text-white backdrop-blur-sm pointer-events-none">
                Click anywhere to place evidence marker
            </div>
        </div>
    );
};

const CrimeScene3DPage: React.FC = () => {
    const [scene, setScene] = useState<CrimeScene | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedMarker, setSelectedMarker] = useState<EvidenceMarker | null>(null);

    // Mock Case ID for demo
    const caseId = "CASE-2023-001";

    useEffect(() => {
        loadScene();
    }, []);

    const loadScene = async () => {
        setLoading(true);
        try {
            // Try to fetch existing scene, or create one if 404
            try {
                const data = await crimeService.getSceneByCase(caseId);
                setScene(data);
            } catch (err) {
                // Determine if it's 404, if so create mock
                console.log("No scene found, creating default...");
                try {
                    const newScene = await crimeService.createScene({
                        case_id: caseId,
                        location: "Apartment 4B, Vasant Vihar",
                        date: new Date().toISOString().split('T')[0],
                        description: "Alleged burglary and assault scene"
                    });
                    setScene(newScene);
                } catch (createErr) {
                    console.log("Backend unavailable, using demo scene data");
                    // Fallback: use mock data when backend is not running
                    setScene({
                        id: "demo-scene-001",
                        case_id: caseId,
                        location: "Apartment 4B, Vasant Vihar, New Delhi",
                        date: new Date().toISOString().split('T')[0],
                        description: "Alleged burglary and assault scene — Demo Reconstruction",
                        model_url: undefined,
                        metadata: { source: "demo", investigator: "SI Sharma" },
                        markers: [
                            {
                                id: "m1",
                                type: EvidenceMarkerType.WEAPON,
                                description: "Kitchen knife found near entrance",
                                position_x: -1.2,
                                position_y: 0,
                                position_z: 0.5,
                                collected_by: "FSL Team A",
                                timestamp: new Date().toISOString()
                            },
                            {
                                id: "m2",
                                type: EvidenceMarkerType.BLOOD,
                                description: "Blood spatter on living room wall",
                                position_x: 0.8,
                                position_y: 1.2,
                                position_z: -0.3,
                                collected_by: "FSL Team A",
                                timestamp: new Date().toISOString()
                            },
                            {
                                id: "m3",
                                type: EvidenceMarkerType.FINGERPRINT,
                                description: "Latent fingerprint on window latch",
                                position_x: 1.5,
                                position_y: 0.8,
                                position_z: 1.2,
                                collected_by: "FSL Team B",
                                timestamp: new Date().toISOString()
                            },
                            {
                                id: "m4",
                                type: EvidenceMarkerType.FOOTPRINT,
                                description: "Shoe impression near balcony door",
                                position_x: -0.5,
                                position_y: 0,
                                position_z: -1.5,
                                collected_by: "FSL Team A",
                                timestamp: new Date().toISOString()
                            },
                            {
                                id: "m5",
                                type: EvidenceMarkerType.OTHER,
                                description: "Broken glass fragments on floor",
                                position_x: 0.2,
                                position_y: 0,
                                position_z: 0.9,
                                collected_by: "FSL Team B",
                                timestamp: new Date().toISOString()
                            }
                        ]
                    });
                }
            }
        } catch (error) {
            console.error("Failed to load scene", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMarker = async (relX: number, relY: number) => {
        if (!scene) return;

        // Convert relative 2D click to mock 3D coords
        const x = (relX * 4) - 2;
        const z = (relY * 4) - 2;

        try {
            const newMarker = await crimeService.addMarker(scene.id, {
                type: EvidenceMarkerType.OTHER,
                description: "New identified Evidence",
                position_x: x,
                position_y: 0,
                position_z: z
            });
            // Refresh
            const updatedScene = await crimeService.getScene(scene.id);
            setScene(updatedScene);
            setSelectedMarker(newMarker);
        } catch (error) {
            console.error("Failed to add marker", error);
        }
    };

    if (loading) return <div className="p-12 text-center text-neutral-400">Loading Holographic Scene...</div>;
    if (!scene) return <div className="p-12 text-center text-red-400">Failed to load scene.</div>;

    return (
        <div className="p-6 h-screen flex flex-col bg-neutral-900 text-neutral-100 overflow-hidden">
            <header className="mb-6 flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-3xl font-serif font-bold flex items-center gap-3 text-cyan-400">
                        <Box className="w-8 h-8" />
                        Crime Scene 3D (Nyaya Rakshak)
                    </h1>
                    <p className="text-neutral-400 mt-1 font-serif">
                        Immersive crime scene reconstruction and evidence mapping.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-700">
                        <Layers className="w-4 h-4" /> Layers
                    </button>
                    <button className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-500 shadow-lg shadow-cyan-900/50">
                        <Camera className="w-4 h-4" /> Export Snapshot
                    </button>
                </div>
            </header>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Main 3D View */}
                <div className="flex-1 flex flex-col gap-4">
                    <div className="bg-neutral-950 rounded-xl p-1 border border-neutral-800 shadow-2xl">
                        <Mock3DViewer markers={scene.markers} onAddMarker={handleAddMarker} />
                    </div>

                    <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-700 flex gap-8 items-center">
                        <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-red-400" />
                            <div>
                                <div className="text-xs text-neutral-400">Location</div>
                                <div className="font-bold">{scene.location}</div>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-neutral-700" />
                        <div>
                            <div className="text-xs text-neutral-400">Date</div>
                            <div className="font-bold">{scene.date}</div>
                        </div>
                        <div className="h-8 w-px bg-neutral-700" />
                        <div>
                            <div className="text-xs text-neutral-400">Evidence Count</div>
                            <div className="font-bold text-cyan-400">{scene.markers.length} Items</div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-80 shrink-0 flex flex-col gap-4 overflow-hidden">
                    <div className="bg-neutral-800 rounded-xl border border-neutral-700 flex-1 flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-neutral-700 font-bold flex justify-between items-center">
                            Evidence List
                            <button className="text-neutral-400 hover:text-white"><MoreVertical className="w-4 h-4" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-2">
                            {scene.markers.map((marker, idx) => (
                                <div
                                    key={marker.id}
                                    onClick={() => setSelectedMarker(marker)}
                                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedMarker?.id === marker.id ? 'bg-cyan-900/20 border-cyan-500/50' : 'bg-neutral-700/30 border-transparent hover:bg-neutral-700/50'}`}
                                >
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="w-5 h-5 flex items-center justify-center bg-neutral-800 rounded-full text-xs font-bold border border-neutral-600">
                                            {idx + 1}
                                        </span>
                                        <span className="font-bold text-sm text-cyan-200">{marker.type.toUpperCase()}</span>
                                    </div>
                                    <p className="text-xs text-neutral-300 pl-8">{marker.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {selectedMarker && (
                        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-4">
                            <h3 className="font-bold mb-2 flex items-center gap-2">
                                <Info className="w-4 h-4 text-cyan-400" /> Details
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-neutral-500">Type</div>
                                    <div className="text-right">{selectedMarker.type}</div>

                                    <div className="text-neutral-500">Position</div>
                                    <div className="text-right font-mono text-xs">
                                        {selectedMarker.position_x.toFixed(1)}, {selectedMarker.position_y.toFixed(1)}, {selectedMarker.position_z.toFixed(1)}
                                    </div>

                                    <div className="text-neutral-500">Collected</div>
                                    <div className="text-right">{new Date(selectedMarker.timestamp).toLocaleDateString()}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CrimeScene3DPage;
