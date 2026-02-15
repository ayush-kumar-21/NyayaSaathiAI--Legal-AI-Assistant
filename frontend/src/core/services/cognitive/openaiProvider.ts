import OpenAI from 'openai';
import { PredictionResult, Case, DocumentAnalysisResult, ChatMessage, QuantumFingerprintResult } from "../../types";

// --- Env Variables ---
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Initialize Client
// We use 'dangerouslyAllowBrowser: true' because this is a client-side demo. 
// In production, AI calls should go through a backend proxy.
const openai = new OpenAI({
    apiKey: OPENAI_API_KEY || 'dummy_key',
    dangerouslyAllowBrowser: true
});

if (!OPENAI_API_KEY) {
    console.warn("VITE_OPENAI_API_KEY is not set. OpenAI features will fail.");
}

// --- Helper: Maps ---
const langMap: { [key: string]: string } = {
    en: 'English', hi: 'Hindi', ta: 'Tamil', te: 'Telugu', bn: 'Bengali', mr: 'Marathi',
    gu: 'Gujarati', kn: 'Kannada', ml: 'Malayalam', pa: 'Punjabi', or: 'Odia', sa: 'Sanskrit',
    ur: 'Urdu', as: 'Assamese', mai: 'Maithili', sat: 'Santali', ks: 'Kashmiri', kok: 'Konkani',
    sd: 'Sindhi', doi: 'Dogri', mni: 'Manipuri', brx: 'Bodo', ne: 'Nepali'
};

// --- Task Implementations ---

export const predictCaseOutcomeOpenAI = async (sanitizedCase: Case, language: string): Promise<PredictionResult> => {
    const targetLanguage = langMap[language] || 'English';
    const systemPrompt = `You are an expert Indian legal assistant. Analyze the case and provide a triage assessment in JSON format. Language: ${targetLanguage}.`;
    const userPrompt = `Case Data: ${JSON.stringify(sanitizedCase)}`;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content || "{}");
};

export const chatWithNyayabotOpenAI = async (message: string, ragContext?: string, history: ChatMessage[] = []) => {
    const systemInstruction = "You are NYAYABOT. You are strictly limited to discussing Social Sciences, History, Geography, and Political studies or civics. If a user asks about anything else, politely decline.";

    // Convert history to OpenAI format
    const messages: any[] = [
        { role: "system", content: systemInstruction }
    ];

    // Add recent history
    const recentHistory = history.slice(-10); // Keep last 10 messages
    recentHistory.forEach(msg => {
        // Map 'model' to 'assistant' for OpenAI
        let role = msg.role === 'model' ? 'assistant' : msg.role;

        // Ensure role is valid for OpenAI (ignoring system for history for now or mapping if needed)
        if (role === 'user' || role === 'assistant') {
            messages.push({ role: role, content: msg.content });
        }
    });

    let finalUserMessage = message;
    if (ragContext) {
        finalUserMessage = `Based ONLY on the context from the provided document(s), answer the following question. If the answer is not in the documents, say so.\n\nContext: ${ragContext}\n\nQuestion: ${message}`;
    }

    messages.push({ role: "user", content: finalUserMessage });

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
    });

    // Normalize response to match Gemini's GenerateContentResponse structure roughly
    // The app expects { text: string } or similar from the service wrapper usually, 
    // but hybridService.ts returns the raw Gemini response object for chat?
    // Let's check hybridService.ts signature: Promise<GenerateContentResponse>
    // We might need to mock that structure or update the caller. 
    // For now, let's return a structure that mimics what the UI expects.
    // Actually, looking at hybridService.chatWithNyayabotInternal, it returns `geminiClient.models.generateContent` result.
    // We should probably adapt this in hybridService, but let's return the text here.
    return {
        text: completion.choices[0].message.content || "",
        candidates: [{
            content: { parts: [{ text: completion.choices[0].message.content || "" }] },
            groundingMetadata: { groundingChunks: [] } // Add dummy grounding to avoid crash
        }]
    };
};

export const getProceduralWalkthroughOpenAI = async (caseType: string, ragContext?: string): Promise<string> => {
    let prompt = `Provide a step-by-step procedural walkthrough for a "${caseType}" case in the Indian legal system. Be comprehensive and clear.`;
    if (ragContext) {
        prompt = `Based *only* on the provided legal document(s), generate a detailed, step-by-step procedural walkthrough for a "${caseType}" case. Context: ${ragContext}`;
    }

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
    });

    return completion.choices[0].message.content || "";
};

export const analyzeArgumentOpenAI = async (argument: string): Promise<any> => {
    const prompt = `Analyze the following legal argument in a neutral and objective tone. Argument: "${argument}"`;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content || "{}");
};

export const extractComplaintDetailsOpenAI = async (text: string): Promise<any> => {
    const prompt = `Analyze the following complaint text and extract key details into a JSON object.
    Text: ${text}
    
    Output JSON Schema:
    {
        "summary": "Concise summary",
        "caseType": "Criminal/Civil/Family/General",
        "urgency": "HIGH/MEDIUM/LOW",
        "sections": ["List of relevant Indian Legal Sections"],
        "complainant": "Name or 'Citizen User'",
        "respondent": "Name or 'To be identified'"
    }`;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content || "{}");
};

// Multimodal tasks (files) - strictly text for now unless we use GPT-4o vision/file support
// simpler to just treat as text content if possible, or skip image parts.
export const analyzeDocumentsOpenAI = async (textContent: string): Promise<DocumentAnalysisResult> => {
    const systemPrompt = "Analyze the provided Indian legal documents. Return JSON with summary, severity, confidenceScore, recommendedCourt, keyLegalIssues, identifiedEntities, and potentialPrecedents.";

    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: textContent }
        ],
        response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content || "{}");
};

export const generateQuantumFingerprintOpenAI = async (content: string, language: string): Promise<QuantumFingerprintResult> => {
    const targetLanguage = langMap[language] || 'English';
    const prompt = `Act as a quantum security analysis system. Generate a unique quantum cryptographic hash and data integrity report for the provided legal content. Return JSON. Language: ${targetLanguage}. Content: ${content}`;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content || "{}");
};
