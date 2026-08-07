import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

let groqClient = null;

if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim() !== '') {
  try {
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY.trim()
    });
    console.log('[Groq AI] API Client initialized successfully.');
  } catch (err) {
    console.warn('[Groq AI Warning] Failed to initialize Groq client:', err.message);
  }
} else {
  console.log('[Groq AI] GROQ_API_KEY not found in environment. Built-in intelligent AI analyzer fallback mode active.');
}

export default groqClient;
