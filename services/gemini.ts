import { GoogleGenAI } from "@google/genai";
import { CarbonRecord } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const GeminiService = {
  getInsights: async (records: CarbonRecord[]): Promise<string> => {
    if (!process.env.API_KEY) return "API Key not configured in environment.";

    // Simplify data for the prompt to save tokens
    const recentData = records.slice(0, 50).map(r => ({
      date: new Date(r.timestamp).toISOString().split('T')[0],
      cat: r.category,
      co2: r.co2e.toFixed(2)
    }));

    const prompt = `
      Analyze the following carbon emission records (last 50 entries):
      ${JSON.stringify(recentData)}

      Provide a concise JSON response with three fields:
      1. "trend": A brief description of the emission trend (increasing/decreasing).
      2. "anomaly": Identify any potential anomalies or spikes.
      3. "recommendation": One actionable tip to reduce emissions based on the highest category.

      Do not use markdown formatting in the response, just raw JSON.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return JSON.stringify({
        trend: "Unable to analyze",
        anomaly: "Error connecting to AI",
        recommendation: "Check connection settings."
      });
    }
  },

  generateReport: async (records: CarbonRecord[]): Promise<string> => {
     if (!process.env.API_KEY) return "API Key not configured.";
     
     const totalCO2 = records.reduce((acc, curr) => acc + curr.co2e, 0).toFixed(2);
     const prompt = `
      You are an Environmental Consultant. Write a professional executive summary for a carbon footprint report.
      Total CO2 Emissions: ${totalCO2} kgCO2e.
      Data Points Analyzed: ${records.length}.
      
      The report should include:
      - Overall performance summary.
      - Key areas of concern.
      - Strategic advice for net-zero transition.
      
      Keep it under 200 words. Format as plain text with clear paragraphs.
     `;

     try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      return "Failed to generate report summary.";
    }
  }
};