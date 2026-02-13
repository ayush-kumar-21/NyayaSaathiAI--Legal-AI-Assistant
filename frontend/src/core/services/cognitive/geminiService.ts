import { hybridService, anomalyDetector as hybridAnomalyDetector } from './hybridService';

// Re-export hybrid service as geminiService for backward compatibility
export const geminiService = hybridService;
export const anomalyDetector = hybridAnomalyDetector;
