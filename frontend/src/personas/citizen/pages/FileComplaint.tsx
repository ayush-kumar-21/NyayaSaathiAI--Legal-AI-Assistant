/**
 * FileComplaint — Citizen complaint page with geolocation.
 * Browser detects location → shows nearest station → citizen writes complaint → submits.
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
    MapPin, Send, Loader2, Shield, FileText, Upload, AlertTriangle,
    CheckCircle2, Navigation, X, Clock, ChevronRight,
} from 'lucide-react';
import api from '../../../core/services/api';
import CaseEscalationPipeline from '../../../shared/components/CaseEscalationPipeline';

// ── Types ────────────────────────────────────────────────

interface StationInfo {
    id: string;
    name: string;
    district: string;
    address: string;
    latitude: number;
    longitude: number;
    distance_km?: number;
}

const FileComplaint: React.FC = () => {
    // Location
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);
    const [locating, setLocating] = useState(false);
    const [locError, setLocError] = useState('');

    // Nearest station
    const [station, setStation] = useState<StationInfo | null>(null);
    const [loadingStation, setLoadingStation] = useState(false);

    // Form fields
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
    const [complaint, setComplaint] = useState('');
    const [incidentDate, setIncidentDate] = useState('');
    const [evidenceFiles, setEvidenceFiles] = useState<string[]>([]);
    const [newEvidence, setNewEvidence] = useState('');

    // Submission
    const [submitting, setSubmitting] = useState(false);
    const [submittedCase, setSubmittedCase] = useState<any>(null);
    const [error, setError] = useState('');

    // ── Geolocation ──────────────────────────────────────

    const detectLocation = useCallback(() => {
        setLocating(true);
        setLocError('');

        if (!navigator.geolocation) {
            setLocError('Geolocation is not supported by your browser');
            setLocating(false);
            // Use Delhi default
            setLat(28.6139);
            setLng(77.2090);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLat(pos.coords.latitude);
                setLng(pos.coords.longitude);
                setLocating(false);
            },
            (err) => {
                setLocError('Location access denied. Using default location (Delhi).');
                setLat(28.6139);
                setLng(77.2090);
                setLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, []);

    useEffect(() => {
        detectLocation();
    }, [detectLocation]);

    // ── Fetch nearest station when location changes ──────

    useEffect(() => {
        if (lat === null || lng === null) return;
        setLoadingStation(true);

        api.get('/escalation/nearest-station', { params: { lat, lng } })
            .then(res => setStation(res.data))
            .catch(() => {
                // Fallback
                setStation({
                    id: 'PS-DEL-001', name: 'Saket Police Station',
                    district: 'South Delhi', address: 'Saket, New Delhi',
                    latitude: 28.5244, longitude: 77.2066, distance_km: 2.1
                });
            })
            .finally(() => setLoadingStation(false));
    }, [lat, lng]);

    // ── Evidence management ──────────────────────────────

    const addEvidence = () => {
        if (newEvidence.trim()) {
            setEvidenceFiles(prev => [...prev, newEvidence.trim()]);
            setNewEvidence('');
        }
    };

    const removeEvidence = (idx: number) => {
        setEvidenceFiles(prev => prev.filter((_, i) => i !== idx));
    };

    // ── Submit complaint ─────────────────────────────────

    const handleSubmit = async () => {
        if (!complaint.trim() || !name.trim() || !contact.trim()) {
            setError('Please fill in all required fields.');
            return;
        }
        if (lat === null || lng === null) {
            setError('Location is required. Please allow location access.');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const response = await api.post('/escalation/complaint', {
                complainant_name: name,
                complainant_contact: contact,
                complaint_text: complaint,
                latitude: lat,
                longitude: lng,
                address: address || undefined,
                evidence_urls: evidenceFiles,
                incident_datetime: incidentDate || undefined,
            });
            setSubmittedCase(response.data);
        } catch (err: any) {
            setError(err?.response?.data?.detail || 'Failed to submit complaint. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // ── Success View ─────────────────────────────────────

    if (submittedCase) {
        return (
            <div style={{
                padding: 24, minHeight: '100vh',
                background: '#0a0a0a', color: '#e4e4e7',
                fontFamily: "'Inter', sans-serif",
            }}>
                {/* Success header */}
                <div style={{
                    padding: '24px 28px', borderRadius: 16, marginBottom: 24,
                    background: 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(16,185,129,0.08))',
                    border: '1px solid rgba(34,197,94,0.25)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <CheckCircle2 size={28} color="#22c55e" />
                        <div>
                            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#22c55e' }}>
                                Complaint Filed Successfully!
                            </h2>
                            <p style={{ margin: 0, fontSize: 13, color: '#86efac', marginTop: 2 }}>
                                FIR Number: <strong>{submittedCase.fir_number}</strong>
                            </p>
                        </div>
                    </div>
                    <div style={{ fontSize: 13, color: '#a1a1aa', lineHeight: 1.6 }}>
                        Your complaint has been automatically routed to{' '}
                        <strong style={{ color: '#e4e4e7' }}>{submittedCase.current_assigned_to}</strong>.
                        Track the progress below.
                    </div>
                </div>

                {/* Case summary */}
                <div style={{
                    padding: '20px 24px', borderRadius: 16, marginBottom: 24,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                }}>
                    <h3 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600 }}>Case Summary</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                            <span style={{ fontSize: 11, color: '#71717a' }}>Complainant</span>
                            <div style={{ fontSize: 14, fontWeight: 500 }}>{submittedCase.complainant_name}</div>
                        </div>
                        <div>
                            <span style={{ fontSize: 11, color: '#71717a' }}>FIR Number</span>
                            <div style={{ fontSize: 14, fontWeight: 500 }}>{submittedCase.fir_number}</div>
                        </div>
                        <div style={{ gridColumn: '1/-1' }}>
                            <span style={{ fontSize: 11, color: '#71717a' }}>Complaint</span>
                            <div style={{ fontSize: 13, color: '#a1a1aa', marginTop: 2 }}>
                                {submittedCase.complaint_text}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Escalation pipeline */}
                <div style={{
                    padding: '20px 24px', borderRadius: 16,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                }}>
                    <h3 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600 }}>
                        Escalation Pipeline
                    </h3>
                    <CaseEscalationPipeline caseData={submittedCase} />
                </div>

                <button
                    onClick={() => setSubmittedCase(null)}
                    style={{
                        marginTop: 20, padding: '12px 24px', borderRadius: 12,
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#a1a1aa', cursor: 'pointer', fontSize: 14,
                    }}
                >
                    File Another Complaint
                </button>
            </div>
        );
    }

    // ── Form View ────────────────────────────────────────

    return (
        <div style={{
            padding: 24, minHeight: '100vh',
            background: '#0a0a0a', color: '#e4e4e7',
            fontFamily: "'Inter', sans-serif",
        }}>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{
                    fontSize: 26, fontWeight: 800, margin: 0,
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                    File a Complaint
                </h1>
                <p style={{ fontSize: 14, color: '#71717a', margin: '6px 0 0' }}>
                    Your complaint will be automatically routed to the nearest police station
                </p>
            </div>

            {/* Location Card */}
            <div style={{
                padding: '16px 20px', borderRadius: 14, marginBottom: 20,
                background: 'rgba(59,130,246,0.06)',
                border: '1px solid rgba(59,130,246,0.15)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Navigation size={18} color="#3b82f6" />
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#93c5fd' }}>Your Location</span>
                    </div>
                    <button onClick={detectLocation} disabled={locating} style={{
                        padding: '4px 12px', borderRadius: 8, border: 'none',
                        background: 'rgba(59,130,246,0.15)', color: '#93c5fd',
                        cursor: 'pointer', fontSize: 12,
                    }}>
                        {locating ? 'Detecting...' : 'Refresh'}
                    </button>
                </div>

                {locError && (
                    <div style={{ fontSize: 12, color: '#fbbf24', marginTop: 8 }}>
                        ⚠️ {locError}
                    </div>
                )}

                {lat !== null && lng !== null && (
                    <div style={{ fontSize: 12, color: '#71717a', marginTop: 6 }}>
                        📍 {lat.toFixed(4)}, {lng.toFixed(4)}
                    </div>
                )}
            </div>

            {/* Nearest Station Card */}
            {station && (
                <div style={{
                    padding: '16px 20px', borderRadius: 14, marginBottom: 20,
                    background: 'rgba(34,197,94,0.06)',
                    border: '1px solid rgba(34,197,94,0.15)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <Shield size={18} color="#22c55e" />
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#86efac' }}>
                            Nearest Police Station
                        </span>
                        {station.distance_km && (
                            <span style={{
                                padding: '2px 8px', borderRadius: 12, fontSize: 11,
                                background: 'rgba(34,197,94,0.15)', color: '#86efac',
                            }}>
                                {station.distance_km} km away
                            </span>
                        )}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#e4e4e7' }}>{station.name}</div>
                    <div style={{ fontSize: 12, color: '#71717a', marginTop: 2 }}>
                        {station.address} • {station.district}
                    </div>
                </div>
            )}

            {loadingStation && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, color: '#71717a' }}>
                    <Loader2 size={16} className="animate-spin" /> Finding nearest station...
                </div>
            )}

            {/* Form */}
            <div style={{
                padding: '24px', borderRadius: 16,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
            }}>
                <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600 }}>Complaint Details</h3>

                {/* Name + Contact */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                        <label style={labelStyle}>Full Name *</label>
                        <input
                            value={name} onChange={e => setName(e.target.value)}
                            placeholder="Enter your full name"
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Contact Number *</label>
                        <input
                            value={contact} onChange={e => setContact(e.target.value)}
                            placeholder="+91 XXXXX XXXXX"
                            style={inputStyle}
                        />
                    </div>
                </div>

                {/* Address */}
                <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>Incident Address</label>
                    <input
                        value={address} onChange={e => setAddress(e.target.value)}
                        placeholder="Where did the incident occur?"
                        style={inputStyle}
                    />
                </div>

                {/* Incident Date */}
                <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>Incident Date & Time</label>
                    <input
                        type="datetime-local"
                        value={incidentDate} onChange={e => setIncidentDate(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                {/* Complaint text */}
                <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>Describe your complaint in detail *</label>
                    <textarea
                        value={complaint} onChange={e => setComplaint(e.target.value)}
                        placeholder="Describe what happened — include names, dates, and any details that will help the investigation..."
                        rows={6}
                        style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                    />
                </div>

                {/* Evidence */}
                <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>Evidence / Supporting Documents</label>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <input
                            value={newEvidence} onChange={e => setNewEvidence(e.target.value)}
                            placeholder="File name or URL (e.g. cctv_footage.mp4)"
                            style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                            onKeyDown={e => e.key === 'Enter' && addEvidence()}
                        />
                        <button onClick={addEvidence} style={{
                            padding: '8px 16px', borderRadius: 10, border: 'none',
                            background: 'rgba(59,130,246,0.15)', color: '#93c5fd',
                            cursor: 'pointer', fontSize: 13,
                        }}>
                            <Upload size={14} />
                        </button>
                    </div>
                    {evidenceFiles.map((f, i) => (
                        <div key={i} style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            padding: '4px 10px', borderRadius: 8, marginRight: 8, marginBottom: 4,
                            background: 'rgba(255,255,255,0.06)', fontSize: 12, color: '#a1a1aa',
                        }}>
                            <FileText size={12} /> {f}
                            <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeEvidence(i)} />
                        </div>
                    ))}
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        padding: '10px 14px', borderRadius: 10, marginBottom: 16,
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                        fontSize: 13, color: '#fca5a5',
                    }}>
                        <AlertTriangle size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                        {error}
                    </div>
                )}

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={submitting || !name || !contact || !complaint}
                    style={{
                        width: '100%', padding: '14px 24px', borderRadius: 14,
                        border: 'none', cursor: submitting ? 'wait' : 'pointer',
                        background: submitting
                            ? 'rgba(59,130,246,0.3)'
                            : 'linear-gradient(135deg, #3b82f6, #6366f1)',
                        color: '#fff', fontSize: 15, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        opacity: (!name || !contact || !complaint) ? 0.5 : 1,
                        transition: 'all 0.3s',
                    }}
                >
                    {submitting ? (
                        <><Loader2 size={18} className="animate-spin" /> Filing Complaint...</>
                    ) : (
                        <><Send size={18} /> Submit Complaint</>
                    )}
                </button>
            </div>

            {/* Pipeline preview */}
            <div style={{
                marginTop: 28, padding: '20px 24px', borderRadius: 16,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
            }}>
                <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600, color: '#71717a' }}>
                    How it works
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {[
                        { icon: <MapPin size={14} />, label: 'Detect Location' },
                        { icon: <Shield size={14} />, label: 'Route to Station' },
                        { icon: <FileText size={14} />, label: 'Investigation' },
                        { icon: <ChevronRight size={14} />, label: 'Escalate if needed' },
                    ].map((step, i) => (
                        <React.Fragment key={i}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                padding: '6px 12px', borderRadius: 10,
                                background: 'rgba(255,255,255,0.04)',
                                fontSize: 12, color: '#a1a1aa',
                            }}>
                                {step.icon} {step.label}
                            </div>
                            {i < 3 && <ChevronRight size={12} style={{ color: '#52525b' }} />}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ── Styles ───────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 12, fontWeight: 600,
    color: '#71717a', marginBottom: 6, letterSpacing: 0.5,
};

const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    color: '#e4e4e7', fontSize: 14,
    outline: 'none', boxSizing: 'border-box',
};

export default FileComplaint;
