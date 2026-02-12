import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import 'dotenv/config';

// 1. Defined an interface for consistency across files
export interface EmailDraft {
  tone: string;
  subject: string;
  body: string;
}

// Interface for the expected JSON structure from the AI
interface GroqDraftResponse {
  drafts: EmailDraft[];
}

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqChoice {
  message: GroqMessage;
}

interface GroqResponseData {
  choices: GroqChoice[];
}

@Injectable()
export class LlmService {
  private readonly apiKey = process.env.GROQ_API_KEY;

  private async callGroq(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('GROQ_API_KEY is not set');
    }

    const response: AxiosResponse<GroqResponseData> = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are an AI that only responds in raw JSON format.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.4,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data.choices?.[0]?.message?.content?.trim() ?? '';
  }

  private cleanJson(text: string): string {
    return text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
  }

  async generateImprovedDescription(
    context: string,

    description: string,
  ): Promise<EmailDraft[]> {
    const prompt = `

  Task:
        Generate email drafts based on:
        Context: "${context}"
        Description: "${description}"
    
        Formatting Rules (STRICT ARCHITECTURAL ALIGNMENT):
    - STRUCTURE: The body MUST be divided into at least 3 distinct paragraphs.
    - NEWLINES: Use exactly "\\n\\n" (double escaped newline) to separate the greeting from the body, paragraphs from each other, and the body from the sign-off.
    - VISUAL: The final string should look like a professionally formatted letter when rendered, not a continuous block.
    - NO WRAPPERS: Do not use HTML tags like <p>. Use only plain text with \\n\\n.

        Special instructions:
        - If the context is job-related, referral-related, internship-related, or career-related:
          - Add more meaningful and professional detail that would positively impress recruiters or senior professionals.
          - Highlight skills, impact, intent, and value without sounding exaggerated.
          - Include a polite line mentioning that "I will attach my CV for reference".
        - If the context is professional (clients, managers, academics, business):
          - Maintain clarity, respect, and confidence.
          - Use concise but impactful language.
        Required JSON structure (exactly this format):
        {
          "drafts": [
            { "tone": "Professional", "subject": "...", "body": "..." },
            { "tone": "Requesting", "subject": "...", "body": "..." },
            { "tone": "Human", "subject": "...", "body": "..." },
            { "tone": "Friendly", "subject": "...", "body": "..." },
            { "tone": "Direct/Assertive", "subject": "...", "body": "..." },
            { "tone": "Concise", "subject": "...", "body": "..." }
          ]
        }
        Rules:
        - Keep emails realistic and human-written
        - THE ALIGMENT SHOULD BE SAME FORMAT AS ON EMAIL ONLY 
        - No emojis unless tone is Friendly
        - Body should be complete and ready to send
        Keep language natural, confident, and professional
        - Each email must be ready to send  
`;
    try {
      const result = await this.callGroq(prompt);
      const clean = this.cleanJson(result);
      const parsed = JSON.parse(clean) as GroqDraftResponse;
      return parsed.drafts || [];
    } catch (error) {
      console.error('Error generating drafts:', error);
      return [];
    }
  }
  async getSubjectsForEmail(
    tone: string,
    emailContent: string,
    numSubjects: number,
  ): Promise<string[]> {
    const prompt = `
      Return ONLY raw JSON. NO markdown.
      {
        "subjects": ["subject 1", "subject 2"]
      }
      Tone: ${tone}
      Email Content: ${emailContent}
      Generate ${numSubjects} subject lines.
    `;

    try {
      const result = await this.callGroq(prompt);
      const clean = this.cleanJson(result);
      // FIX: Cast to specific object type
      const parsed = JSON.parse(clean) as { subjects?: string[] };
      return parsed.subjects ?? [];
    } catch (error) {
      console.error('Groq error:', error);
      return [];
    }
  }
}
