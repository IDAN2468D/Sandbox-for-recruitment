import { GoogleGenAI, Type } from "@google/genai";
import { JobDescription, InterviewQuestion, CandidateProfile, AdvancedAssets } from "../types";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY is not defined");
    }
    return new GoogleGenAI({ apiKey });
};

const MODEL_NAME = "gemini-3-pro-preview";
const THINKING_BUDGET = 32768;

export const generateJobAssets = async (rawNotes: string, imageBase64?: string): Promise<{ jobDescription: JobDescription, interviewQuestions: InterviewQuestion[] }> => {
    const ai = getClient();
    
    const promptText = `
    You are an expert Recruitment Consultant speaking Hebrew.
    Based on the following raw notes (and attached image if provided), generate a comprehensive Job Description and an Extended Interview Guide in Hebrew.
    
    Raw Notes:
    ${rawNotes}

    Output 1: Polished Job Description (Hebrew)
    - TONE: Professional, energetic, and compelling.
    - ACTIVE VOICE CHECK: STRICTLY use Active Voice (לשון פעילה) with strong action verbs. Avoid passive phrases like "will be responsible for". Use "Lead", "Drive", "Create", "Manage" (in Hebrew equivalents like "הובל", "נהל", "פתח").
    
    Structure:
    1. Title
    2. About Us: Brief, engaging company vision/culture intro.
    3. Key Selling Points: 3 top reasons to join.
    4. Role Summary.
    5. Responsibilities: Achievement-oriented bullets using strong active verbs.
    6. Hard Skills: Technical must-haves. IMPORTANT: Include a placeholder like "[Placeholder: Short coding challenge related to X]" as one of the items.
    7. Nice-to-Have Skills: Advantages.
    8. Soft Skills: Behavioral attributes.
    9. What We Offer: Benefits, growth, work-life balance.
    10. Salary: Extract the salary range if available into numerical min/max values.

    Output 2: Extended Interview Guide (21 Questions) (Hebrew)
    - 21 Behavioral Questions (STAR method).
    - Map to specific skills.
    - Distribution:
       - 10 General Competency (Hard/Soft Skills)
       - 5 Conflict Resolution & Interpersonal
       - 3 Complex Problem Solving (Label as "Problem Solving")
       - 3 DEI (Diversity, Equity, and Inclusion) (Label as "DEI"). Questions assessing awareness of bias, inclusive collaboration, and fostering a diverse environment.

    Return JSON only. All strings in Hebrew.
    `;

    const contents = [];
    if (imageBase64) {
        contents.push({
            inlineData: {
                mimeType: "image/jpeg",
                data: imageBase64
            }
        });
        contents.push({ text: "Please also analyze this image which contains additional notes or context for the role." });
    }
    contents.push({ text: promptText });

    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: contents,
        config: {
            thinkingConfig: { thinkingBudget: THINKING_BUDGET },
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    jobDescription: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            aboutUs: { type: Type.STRING },
                            keySellingPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                            summary: { type: Type.STRING },
                            responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                            hardSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                            niceToHaves: { type: Type.ARRAY, items: { type: Type.STRING } },
                            softSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                            whatWeOffer: { type: Type.ARRAY, items: { type: Type.STRING } },
                            salary: {
                                type: Type.OBJECT,
                                properties: {
                                    min: { type: Type.NUMBER },
                                    max: { type: Type.NUMBER },
                                    currency: { type: Type.STRING }
                                },
                                required: ["min", "max", "currency"]
                            }
                        },
                        required: ["title", "aboutUs", "keySellingPoints", "summary", "responsibilities", "hardSkills", "niceToHaves", "softSkills", "whatWeOffer"]
                    },
                    interviewQuestions: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                question: { type: Type.STRING },
                                targetSkill: { type: Type.STRING },
                                type: { type: Type.STRING, enum: ["Hard Skill", "Soft Skill", "Problem Solving", "Conflict Resolution", "DEI"] }
                            },
                            required: ["question", "targetSkill", "type"]
                        }
                    }
                },
                required: ["jobDescription", "interviewQuestions"]
            }
        }
    });

    const result = JSON.parse(response.text || "{}");
    
    // Add IDs to questions for React keys
    const questionsWithIds = result.interviewQuestions?.map((q: any, index: number) => ({
        ...q,
        id: `q-${index}-${Date.now()}`
    })) || [];

    return {
        jobDescription: result.jobDescription,
        interviewQuestions: questionsWithIds
    };
};

export const generateSpeech = async (text: string): Promise<string> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: {
            parts: [{ text: text }]
        },
        config: {
            responseModalities: ["AUDIO"],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' }
                }
            }
        }
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
};

export const generateCandidateProfiles = async (jd: JobDescription, questions: InterviewQuestion[]): Promise<CandidateProfile[]> => {
    const ai = getClient();

    const prompt = `
    Based on the Job Description provided, generate three distinct Ideal Candidate Profiles in Hebrew.

    Job Title: ${jd.title}
    
    Profiles to generate:
    1. The High-Potential Junior
    2. The Core Mid-Level
    3. The Veteran Specialist

    For each, include:
    - Description (in Hebrew)
    - Key Selling Point (Hook) (in Hebrew)
    - Potential Red Flag (Weakness to probe) (in Hebrew)
    
    IMPORTANT: Keep the 'type' field exactly as English enum.
    `;

    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
            thinkingConfig: { thinkingBudget: THINKING_BUDGET },
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        type: { type: Type.STRING, enum: ["High-Potential Junior", "Core Mid-Level", "Veteran Specialist"] },
                        description: { type: Type.STRING },
                        keySellingPoint: { type: Type.STRING },
                        redFlag: { type: Type.STRING }
                    },
                    required: ["type", "description", "keySellingPoint", "redFlag"]
                }
            }
        }
    });

    const result = JSON.parse(response.text || "[]");
    
    return result.map((p: any, index: number) => ({
        ...p,
        id: `p-${index}-${Date.now()}`
    }));
};

export const generateAdvancedAssets = async (jd: JobDescription): Promise<AdvancedAssets> => {
    const ai = getClient();

    const prompt = `
    Based on the Job Description below, generate a comprehensive "Pro Recruitment Toolkit" with 8 distinct assets in Hebrew.

    Job Context:
    Title: ${jd.title}
    Summary: ${jd.summary}
    Responsibilities: ${jd.responsibilities.join(", ")}
    Hard Skills: ${jd.hardSkills.join(", ")}

    --- ASSETS TO GENERATE ---

    1. Recruiter Outreach Message: 
       - Catchy headline, key challenge, one hard skill, call to action. Max 5 lines.

    2. Success Metrics (KPIs): 
       - 90 Days (Learning), 6 Months (Delivery), 12 Months (Impact).

    3. Bias Analysis: 
       - 3 phrases to neutralize.

    4. Hiring Challenge (Home Assignment):
       - Objective, 2 Deliverables, Duration (3-4h), Evaluation Criteria.

    5. Screening Questions (5 Total):
       - Covers: Compensation, Availability, Motivation, Hard Skill check.

    6. Onboarding Plan (30 Days):
       - Week 1 checklist.
       - Day 30 Milestone project.

    7. Compensation Analysis:
       - 2 non-monetary competitive advantages.
       - 1 negotiation tactic for a +15% salary ask.

    8. Stakeholder Map:
       - 3 Key Stakeholders (Role + Collaboration Goal).

    Return strictly in JSON.
    `;

    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
            thinkingConfig: { thinkingBudget: THINKING_BUDGET },
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    outreachMessage: {
                        type: Type.OBJECT,
                        properties: {
                            headline: { type: Type.STRING },
                            content: { type: Type.STRING }
                        },
                        required: ["headline", "content"]
                    },
                    successMetrics: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                timeframe: { type: Type.STRING },
                                goal: { type: Type.STRING }
                            },
                            required: ["timeframe", "goal"]
                        }
                    },
                    biasAnalysis: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                originalText: { type: Type.STRING },
                                biasType: { type: Type.STRING },
                                suggestion: { type: Type.STRING }
                            },
                            required: ["originalText", "biasType", "suggestion"]
                        }
                    },
                    hiringChallenge: {
                        type: Type.OBJECT,
                        properties: {
                            objective: { type: Type.STRING },
                            deliverables: { type: Type.ARRAY, items: { type: Type.STRING } },
                            duration: { type: Type.STRING },
                            evaluationCriteria: { type: Type.ARRAY, items: { type: Type.STRING } }
                        },
                        required: ["objective", "deliverables", "duration", "evaluationCriteria"]
                    },
                    screeningQuestions: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                category: { type: Type.STRING },
                                question: { type: Type.STRING }
                            },
                            required: ["category", "question"]
                        }
                    },
                    onboardingPlan: {
                        type: Type.OBJECT,
                        properties: {
                            week1: { type: Type.ARRAY, items: { type: Type.STRING } },
                            day30Milestone: { type: Type.STRING }
                        },
                        required: ["week1", "day30Milestone"]
                    },
                    compAnalysis: {
                        type: Type.OBJECT,
                        properties: {
                            competitiveAdvantages: { type: Type.ARRAY, items: { type: Type.STRING } },
                            negotiationTactic: { type: Type.STRING }
                        },
                        required: ["competitiveAdvantages", "negotiationTactic"]
                    },
                    stakeholderMap: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                role: { type: Type.STRING },
                                collaborationGoal: { type: Type.STRING }
                            },
                            required: ["role", "collaborationGoal"]
                        }
                    }
                },
                required: ["outreachMessage", "successMetrics", "biasAnalysis", "hiringChallenge", "screeningQuestions", "onboardingPlan", "compAnalysis", "stakeholderMap"]
            }
        }
    });

    return JSON.parse(response.text || "{}") as AdvancedAssets;
};

export const streamChatResponse = async (
    history: { role: 'user' | 'model', text: string }[],
    newMessage: string,
    context?: string
) => {
    const ai = getClient();
    
    const systemInstruction = `You are a helpful recruitment assistant AI speaking Hebrew. 
    You are helping a user refine recruitment documents. 
    Use the following context about the current role if available: ${context || "No context yet."}
    
    Be concise, helpful, and professional. Reply in Hebrew.`;

    const chat = ai.chats.create({
        model: MODEL_NAME,
        config: {
            systemInstruction,
            thinkingConfig: { thinkingBudget: THINKING_BUDGET },
            tools: [{ googleMaps: {} }] // Enable Google Maps Grounding
        },
        history: history.map(h => ({
            role: h.role,
            parts: [{ text: h.text }]
        }))
    });

    return chat.sendMessageStream({ message: newMessage });
};