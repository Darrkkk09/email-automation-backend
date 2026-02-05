import axios from 'axios';

// 1. Get AI Drafts (Calls @Post('improve'))
export async function getAIDrafts(context: string, description: string) {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/email/improve`, {
            context,
            description,
        });
        // Returns the { result: EmailDraft[] } from your NestJS controller
        return response.data.result;
    } catch (err) {
        throw err;
    }

}

// 2. Send Final Email (Calls @Post('send'))
export async function sendFinalEmail(payload: {
    to: string,
    replyTo: string,
    subject: string,
    description: string,
    UserName: string
}) {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/email/send`, payload);
    // Returns { status: 'Email sent successfully' }
    return response.data;
}