import groqClient from '../config/groq.js';

/**
 * Fallback Rule-based AI Engine when Groq API key is absent or unreachable
 */
const fallbackAnalysis = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();

  let category = 'Public Property';
  let department = 'Public Works';
  let priority = 'Medium';

  if (text.includes('garbage') || text.includes('waste') || text.includes('trash') || text.includes('dirty') || text.includes('dump') || text.includes('clean')) {
    category = 'Garbage';
    department = 'Sanitation';
    priority = text.includes('week') || text.includes('month') || text.includes('smell') ? 'High' : 'Medium';
  } else if (text.includes('light') || text.includes('dark') || text.includes('lamp') || text.includes('pole') || text.includes('electricity') || text.includes('wire')) {
    category = text.includes('wire') || text.includes('power') ? 'Electricity' : 'Street Light';
    department = 'Electrical Department';
    priority = text.includes('dark') || text.includes('safety') ? 'High' : 'Medium';
  } else if (text.includes('water') || text.includes('pipe') || text.includes('leak') || text.includes('drain') || text.includes('sewage') || text.includes('overflow')) {
    category = text.includes('drain') || text.includes('sewage') ? 'Drainage' : 'Water Supply';
    department = text.includes('drain') ? 'Drainage & Sewage' : 'Water Works Department';
    priority = text.includes('overflow') || text.includes('contaminat') ? 'High' : 'Medium';
  } else if (text.includes('pothole') || text.includes('road') || text.includes('tar') || text.includes('asphalt') || text.includes('footpath') || text.includes('street')) {
    category = 'Road';
    department = 'Road & Infrastructure';
    priority = text.includes('accident') || text.includes('deep') ? 'Critical' : 'High';
  } else if (text.includes('traffic') || text.includes('signal') || text.includes('jam') || text.includes('vehicle')) {
    category = 'Traffic';
    department = 'Traffic Management Unit';
    priority = 'Medium';
  }

  if (text.includes('urgent') || text.includes('danger') || text.includes('hazard') || text.includes('emergency')) {
    priority = 'Critical';
  }

  const cleanTitle = title.charAt(0).toUpperCase() + title.slice(1);
  const cleanDesc = description.charAt(0).toUpperCase() + description.slice(1);

  return {
    category,
    department,
    priority,
    summary: `${category} issue reported regarding "${cleanTitle}".`,
    improvedComplaint: `${cleanTitle}: ${cleanDesc} (Formatted & analyzed for municipal dispatch).`
  };
};

/**
 * Analyzes citizen complaint using Groq AI Llama 3.3 model
 */
export const analyzeComplaintWithAI = async (title, description) => {
  if (!groqClient) {
    console.log('[Groq AI] Executing fallback analyzer...');
    return fallbackAnalysis(title, description);
  }

  try {
    const systemPrompt = `You are CivicRoute AI, an expert municipal AI assistant that categorizes and formats citizen complaints for government action.
Analyze the user's civic issue and respond ONLY with a valid JSON object matching this schema:
{
  "category": "One of: Road, Drainage, Garbage, Street Light, Water Supply, Electricity, Traffic, Public Property",
  "department": "Department Name (e.g. Sanitation, Electrical Department, Water Works, Road Infrastructure, Traffic Unit)",
  "priority": "One of: Low, Medium, High, Critical",
  "summary": "1 concise sentence summarizing the complaint.",
  "improvedComplaint": "A polite, detailed, professional rephrasing of the complaint suitable for official work orders."
}`;

    const userPrompt = `Complaint Title: ${title}\nComplaint Description: ${description}`;

    const chatCompletion = await groqClient.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2,
      response_format: { type: 'json_object' }
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('Empty response from Groq AI');
    }

    const result = JSON.parse(responseContent);
    return {
      category: result.category || 'Public Property',
      department: result.department || 'Public Works',
      priority: result.priority || 'Medium',
      summary: result.summary || title,
      improvedComplaint: result.improvedComplaint || description
    };
  } catch (error) {
    console.error('[Groq AI Error]', error.message);
    return fallbackAnalysis(title, description);
  }
};
