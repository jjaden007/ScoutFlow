import { GoogleGenAI, Type } from "@google/genai";
import { Business, UserProfile } from "../types";

function getAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is not set');
  return new GoogleGenAI({ apiKey });
}

export type { Business };

export async function searchBusinesses(category: string, location: string): Promise<Business[]> {
  const prompt = `Find 10 real local businesses in the category "${category}" located in "${location}". 
  Provide their name, website (if any), contact email address (if available), phone number, rating, and address.
  Use Google Search to find accurate contact information. Format the output as a JSON array of objects.`;

  const response = await getAI().models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            website: { type: Type.STRING },
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            rating: { type: Type.NUMBER },
            address: { type: Type.STRING },
          },
          required: ["name"],
        },
      },
    },
  });

  try {
    const businesses = JSON.parse(response.text || "[]");
    return businesses.map((b: any, index: number) => ({
      ...b,
      id: `${b.name.replace(/\s+/g, '-').toLowerCase()}-${index}`,
      category,
      location
    }));
  } catch (e) {
    console.error("Failed to parse businesses", e);
    return [];
  }
}

export async function auditWebsite(business: Business): Promise<string> {
  const prompt = business.website 
    ? `Perform a digital audit for the business "${business.name}" with website "${business.website}". 
       Analyze potential issues like mobile responsiveness, speed, and SEO based on general knowledge or search.
       Provide a concise report in Markdown format with bullet points.`
    : `The business "${business.name}" has NO website. Explain why this is a major disadvantage for a ${business.category} in ${business.location} and what they are missing out on. 
       Provide a concise report in Markdown format.`;

  const response = await getAI().models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    }
  });

  return response.text || "Audit failed to generate.";
}

export async function generateOutreach(business: Business, auditReport: string, userProfile?: UserProfile): Promise<string> {
  const userContext = userProfile 
    ? `My name is ${userProfile.full_name} and my business is "${userProfile.business_name}" (${userProfile.business_website}). 
       Here is what we do: ${userProfile.business_description}. 
       Please tailor the message so it comes from me personally and offers our specific expertise. 
       My email is ${userProfile.email} if you need to include it, but keep the message concise.`
    : `The goal is to offer digital improvement services (web design/SEO).`;

  const prompt = `Based on this audit report for "${business.name}":
  
  ${auditReport}
  
  ${userContext}
  
  Generate a highly personalized, professional, and friendly cold outreach message (email/SMS style).
  Keep it short, empathetic, and focused on helping them get more customers.
  Do not use placeholders like [Your Name], just write the message body.`;

  const response = await getAI().models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  return response.text || "Outreach message failed to generate.";
}

export async function generateActionPlan(business: Business, auditReport: string, userProfile?: UserProfile): Promise<string> {
  const prompt = `Based on this digital audit for "${business.name}":
  
  ${auditReport}
  
  Create a comprehensive "Strategic Action Plan" that a digital agency (like ${userProfile?.business_name || 'ours'}) would present to this client.
  Include:
  1. Immediate Fixes (Low hanging fruit)
  2. Medium-term Growth Strategies
  3. Long-term Digital Transformation goals
  
  Format the output in clean Markdown with clear headings and bullet points.`;

  const response = await getAI().models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  return response.text || "Action plan failed to generate.";
}
