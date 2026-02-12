// src/types/email.ts
export interface EmailDraft {
  tone: 'Professional' | 'Human' | 'Friendly' | 'Concise';
  subject: string;
  body: string;
}

export interface SendEmailPayload {
  to: string;
  subject: string;
  body: string;
  userName: string;
}
