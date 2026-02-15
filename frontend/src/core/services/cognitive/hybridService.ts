import { GoogleGenAI, Type, GenerateContentResponse, Part } from "@google/genai";
import { PredictionResult, Case, DocumentAnalysisResult, ChatMessage, QuantumFingerprintResult } from "../../types";
import { withErrorRecovery } from "../../lib/withErrorRecovery";

// --- Env Variables ---
const GEMINI_API_KEY = import.meta.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY (Gemini) is not set.");
}

// --- Initialize Clients ---
// Use a dummy key if missing to prevent top-level crash. Service calls will fail gracefully later.
const safeGeminiKey = GEMINI_API_KEY || "dummy_key_for_initialization";
console.log("[GeminiService] Init. Key Present:", !!GEMINI_API_KEY, "Length:", GEMINI_API_KEY?.length);
const geminiClient = new GoogleGenAI({ apiKey: safeGeminiKey });

// --- Helper: Maps ---
const langMap: { [key: string]: string } = {
    en: 'English', hi: 'Hindi', ta: 'Tamil', te: 'Telugu', bn: 'Bengali', mr: 'Marathi',
    gu: 'Gujarati', kn: 'Kannada', ml: 'Malayalam', pa: 'Punjabi', or: 'Odia', sa: 'Sanskrit',
    ur: 'Urdu', as: 'Assamese', mai: 'Maithili', sat: 'Santali', ks: 'Kashmiri', kok: 'Konkani',
    sd: 'Sindhi', doi: 'Dogri', mni: 'Manipuri', brx: 'Bodo', ne: 'Nepali'
};

// --- Task Implementations ---

// 1. Case Prediction (Gemini Only)
const predictCaseOutcomeInternal = async (sanitizedCase: Case, language: string): Promise<PredictionResult> => {
    const targetLanguage = langMap[language] || 'English';
    const prompt = `Analyze the following Indian legal case and provide a triage assessment. The entire JSON response, including all text fields like rationale and contributingFactors, must be in ${targetLanguage}. Case Data: ${JSON.stringify(sanitizedCase)}`;

    const response = await geminiClient.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    priority: { type: Type.STRING, description: 'Priority level of the case (High, Medium, or Low).' },
                    rationale: { type: Type.STRING, description: 'A detailed explanation for the assigned priority.' },
                    contributingFactors: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Top 3-5 factors influencing the priority.' },
                    legalCitations: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Relevant legal acts or precedents.' },
                },
                required: ["priority", "rationale", "contributingFactors", "legalCitations"],
            },
        },
    });
    return JSON.parse(response.text?.trim() || "{}");
};

// 2. Chat with Nyayabot (Gemini Only)
const chatWithNyayabotInternal = async (message: string, ragParts?: Part[], history: ChatMessage[] = []): Promise<GenerateContentResponse> => {
    // History Processing
    let processedHistory = history.slice(0, -1);
    const firstUserIndex = processedHistory.findIndex(m => m.role === 'user');
    processedHistory = firstUserIndex > -1 ? processedHistory.slice(firstUserIndex) : [];

    const contents: any[] = processedHistory.filter(msg => msg.role === 'user' || msg.role === 'model')
        .map(msg => ({ role: msg.role, parts: [{ text: msg.content || '' }] }));

    const currentMessageParts: Part[] = [];
    const geminiMessage = ragParts && ragParts.length > 0
        ? `Based ONLY on the context from the provided document(s), answer the following question about Social Sciences, History, Geography, or Civics. If the answer is not in the documents, say that you cannot find the answer in the provided context.\n\nQuestion: ${message}`
        : message;

    if (ragParts) currentMessageParts.push(...ragParts);
    currentMessageParts.push({ text: geminiMessage });

    contents.push({ role: 'user', parts: currentMessageParts });

    return await geminiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        // @ts-ignore
        systemInstruction: "You are NYAYABOT. You are strictly strictly limited to discussing Social Sciences, History, Geography, and Political studies or civics. If a user asks about anything else, politely decline.",
    });
};

// 3. Procedural Walkthrough (Gemini Only)
const getProceduralWalkthroughInternal = async (caseType: string, ragParts?: Part[]): Promise<string> => {
    const promptParts: Part[] = [];
    let geminiPrompt = `Provide a step-by-step procedural walkthrough for a "${caseType}" case in the Indian legal system. Be comprehensive and clear.`;

    if (ragParts && ragParts.length > 0) {
        promptParts.push(...ragParts);
        geminiPrompt = `Based *only* on the provided legal document(s), generate a detailed, step-by-step procedural walkthrough for a "${caseType}" case. If the documents do not contain enough information, state that clearly.`;
    }
    promptParts.push({ text: geminiPrompt });

    const response = await geminiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: promptParts }
    });
    return response.text || '';
};

// 4. Analyze Argument (Gemini Only)
const analyzeArgumentInternal = async (argument: string): Promise<any> => {
    const prompt = `You are a helpful legal assistant. Analyze the following legal argument in a neutral and objective tone. Argument: "${argument}"`;

    const response = await geminiClient.models.generateContent({
        model: 'gemini-1.5-pro',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    introduction: { type: Type.STRING },
                    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                    counterarguments: { type: Type.ARRAY, items: { type: Type.STRING } },
                    strategicRecommendations: { type: Type.STRING }
                },
                required: ["introduction", "strengths", "weaknesses", "counterarguments", "strategicRecommendations"]
            }
        }
    });
    return JSON.parse(response.text?.trim() || "{}");
};

// --- Single Provider Tasks (Gemini Only - Multimodal high dependency) ---

const analyzeDocumentsInternal = async (parts: Part[]): Promise<DocumentAnalysisResult> => {
    const response = await geminiClient.models.generateContent({
        model: "gemini-2.5-pro",
        contents: { parts: [...parts, { text: "Analyze the provided Indian legal documents. Summarize them, assess severity, provide a confidence score for your analysis, and recommend the appropriate court. Also, extract the key legal issues, identify all entities (people, organizations, locations, dates), and list any potential legal precedents or cited case laws." }] },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    summary: { type: Type.STRING, description: "A concise summary of the document's content." },
                    severity: { type: Type.STRING, enum: ['High', 'Medium', 'Low'], description: "The severity or urgency of the case based on the document." },
                    confidenceScore: { type: Type.NUMBER, description: "A score from 0.0 to 1.0 indicating the confidence in the analysis." },
                    recommendedCourt: { type: Type.STRING, description: "The appropriate court in the Indian legal system for this matter." },
                    keyLegalIssues: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of the main legal questions or points of contention." },
                    identifiedEntities: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                type: { type: Type.STRING, enum: ['PERSON', 'ORGANIZATION', 'LOCATION', 'DATE'] }
                            },
                            required: ["name", "type"]
                        },
                        description: "A list of named entities found in the document."
                    },
                    potentialPrecedents: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of relevant case laws, statutes, or legal precedents mentioned or implied." }
                },
                required: ["summary", "severity", "confidenceScore", "recommendedCourt", "keyLegalIssues", "identifiedEntities", "potentialPrecedents"],
            },
        }
    });
    return JSON.parse(response.text ? response.text.trim() : "{}");
};

const generateQuantumFingerprintInternal = async (content: string | Part[], language: string): Promise<QuantumFingerprintResult> => {
    const targetLanguage = langMap[language] || 'English';
    let parts: Part[] = [];
    if (typeof content === 'string') {
        parts.push({ text: `Document Content: "${content}"` });
    } else {
        parts = content;
    }
    parts.push({ text: `Act as a quantum security analysis system. Based on the provided document content (text or files), generate a unique quantum cryptographic hash and a data integrity report. The content is considered a legal document, and the report should verify its integrity. The entire JSON response must be in ${targetLanguage}.` });

    const response = await geminiClient.models.generateContent({
        model: "gemini-2.5-pro",
        contents: { parts: parts },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    quantumHash: { type: Type.STRING, description: "A unique, long, hexadecimal-like string representing the document's quantum fingerprint." },
                    integrityStatus: { type: Type.STRING, enum: ['Verified & Secure', 'Potential Tampering Detected'], description: "The verification status of the document." },
                    anomaliesDetected: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of any detected anomalies or inconsistencies." },
                    verificationTimestamp: { type: Type.STRING, description: "The ISO 8601 timestamp of when the verification was performed." }
                },
                required: ["quantumHash", "integrityStatus", "anomaliesDetected", "verificationTimestamp"]
            },
        },
    });
    return JSON.parse(response.text ? response.text.trim() : "{}");
};

// --- Fallbacks ---
const fallbackPrediction: PredictionResult = {
    priority: 'Medium',
    rationale: 'Could not retrieve AI analysis due to a network error. This is a fallback response.',
    contributingFactors: ['API communication failure'],
    legalCitations: ['N/A']
};

const fallbackDocAnalysis: DocumentAnalysisResult = {
    summary: 'Could not analyze document due to an error.',
    severity: 'Medium',
    confidenceScore: 0.0,
    recommendedCourt: 'N/A',
    keyLegalIssues: ['Error retrieving data.'],
    identifiedEntities: [],
    potentialPrecedents: ['N/A'],
    riskScore: 0,
    entities: [],
    sentiment: 'Neutral'
};

const fallbackFingerprint: QuantumFingerprintResult = {
    quantumHash: 'Error generating hash: Fallback response due to API failure.',
    integrityStatus: 'Potential Tampering Detected',
    anomaliesDetected: ['Failed to connect to the quantum verification service.'],
    verificationTimestamp: new Date().toISOString(),
    hash: '',
    timestamp: new Date().toISOString(),
    method: 'Unknown',
    verified: false
};

// --- Export ---
// --- Provider Selection ---
const AI_PROVIDER = import.meta.env.VITE_AI_PROVIDER || 'GEMINI'; // 'GEMINI' | 'OPENAI'

import {
    predictCaseOutcomeOpenAI,
    chatWithNyayabotOpenAI,
    getProceduralWalkthroughOpenAI,
    analyzeArgumentOpenAI,
    extractComplaintDetailsOpenAI,
    analyzeDocumentsOpenAI,
    generateQuantumFingerprintOpenAI
} from './openaiProvider';

// --- Helper to extract text from Parts for OpenAI ---
const partsToText = (parts: Part[] | string): string => {
    if (typeof parts === 'string') return parts;
    return parts.map(p => p.text).join('\n');
};

export const hybridService = {
    predictCaseOutcome: (sanitizedCase: Case, language: string) =>
        withErrorRecovery(async () => {
            if (AI_PROVIDER === 'OPENAI') {
                return await predictCaseOutcomeOpenAI(sanitizedCase, language);
            }
            return await predictCaseOutcomeInternal(sanitizedCase, language);
        }, fallbackPrediction),

    analyzeDocuments: (parts: Part[]) =>
        withErrorRecovery(async () => {
            if (AI_PROVIDER === 'OPENAI') {
                const text = partsToText(parts);
                return await analyzeDocumentsOpenAI(text);
            }
            return await analyzeDocumentsInternal(parts);
        }, fallbackDocAnalysis),

    chatWithNyayabot: async (message: string, ragParts?: Part[], history: ChatMessage[] = []) => {
        // Enforce OpenAI for NyayaBot as per user request
        // if (AI_PROVIDER === 'OPENAI') { 
        if (true) { // Forced OpenAI for NyayaBot
            console.log("NyayaBot: Forced OpenAI mode active");
            const ragText = ragParts ? partsToText(ragParts) : undefined;
            return await chatWithNyayabotOpenAI(message, ragText, history);
        }
        return await chatWithNyayabotInternal(message, ragParts, history);
    },

    generateQuantumFingerprint: (content: string | Part[], language: string) =>
        withErrorRecovery(async () => {
            if (AI_PROVIDER === 'OPENAI') {
                const text = partsToText(content as Part[]); // Cast mainly for safe handling
                return await generateQuantumFingerprintOpenAI(text, language);
            }
            return await generateQuantumFingerprintInternal(content, language);
        }, fallbackFingerprint),

    transcribeAudio: async (audioPart: Part) => {
        // OpenAI Whisper would be ideal here, but for now we fallback to Gemini or just skip if OpenAI selected but no audio impl
        // or we could use OpenAI audio API if we had the blob. 
        // For this hackathon scope, default to Gemini or Mock.
        if (AI_PROVIDER === 'OPENAI') {
            // Placeholder for OpenAI Whisper integration
            console.warn("OpenAI Audio Transcription not fully implemented yet.");
            return "Audio transcription via OpenAI pending implementation.";
        }

        const response = await geminiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [audioPart, { text: "Transcribe this audio recording exactly as spoken." }] }
        });
        return response.text || '';
    },

    extractComplaintDetails: async (text: string): Promise<any> => {
        if (AI_PROVIDER === 'OPENAI') {
            return await extractComplaintDetailsOpenAI(text);
        }

        const prompt = `Analyze the following complaint text and extract key details into a JSON object.
        Text: ${JSON.stringify(text)}
        
        Output JSON Schema:
        {
            "summary": "Concise summary of the incident (max 200 chars)",
            "caseType": "Criminal" | "Civil" | "Family" | "General",
            "urgency": "HIGH" | "MEDIUM" | "LOW",
            "sections": ["List of relevant Indian Legal Sections (BNS/IPC) inferred from the text"],
            "complainant": "Name of complainant if mentioned, else 'Citizen User'",
            "respondent": "Name of respondent/accused if mentioned, else 'To be identified'"
        }`;

        const response = await geminiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        return JSON.parse(response.text?.trim() || "{}");
    },

    analyzeArgument: async (argument: string) => {
        if (AI_PROVIDER === 'OPENAI') {
            return await analyzeArgumentOpenAI(argument);
        }
        return await analyzeArgumentInternal(argument);
    },

    getProceduralWalkthrough: async (caseType: string, ragParts?: Part[]) => {
        if (AI_PROVIDER === 'OPENAI') {
            const ragText = ragParts ? partsToText(ragParts) : undefined;
            return await getProceduralWalkthroughOpenAI(caseType, ragText);
        }
        return await getProceduralWalkthroughInternal(caseType, ragParts);
    }
};

export const anomalyDetector = {
    logEvent: (message: string, data: any) => {
        console.warn(`[ANOMALY DETECTED] ${message}`, data);
    }
};
