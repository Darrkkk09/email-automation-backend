'use client';
import { useState } from 'react';
import { getAIDrafts, sendFinalEmail } from '@/lib/api-client';

// 1. Define the structure of a draft
interface EmailDraft {
    tone: string;
    subject: string;
    body: string;
}

export default function EmailPage() {
    // 2. Tell useState this is an array of EmailDraft objects
    const [drafts, setDrafts] = useState<EmailDraft[]>([]);

    const handleGenerate = async () => {
        const results = await getAIDrafts("New SEO Lead", "Wants a quote for 6 months");
        setDrafts(results);
    };

    // 3. FIX: Change 'draft: string' to 'draft: EmailDraft'
    const handleSend = async (draft: EmailDraft) => {
        const result = await sendFinalEmail({
            to: "client@example.com",
            replyTo: "manager@company.com",
            subject: draft.subject, // Now TS knows .subject exists
            description: draft.body, 
            UserName: "John Doe"
        });
        alert(result.status);
    };

    return (
        <div className="p-8">
            <button onClick={handleGenerate} className="bg-blue-600 text-white p-2 rounded">
                Generate Drafts
            </button>

            {drafts.map((draft, index) => (
                <div key={index} className="border p-4 my-2 rounded">
                    <h3 className="font-bold">{draft.subject}</h3>
                    <p>{draft.body}</p>
                    <button 
                        onClick={() => handleSend(draft)} 
                        className="bg-green-600 text-white px-4 py-1 mt-2 rounded"
                    >
                        Confirm & Send
                    </button>
                </div>
            ))}
        </div>
    );
}