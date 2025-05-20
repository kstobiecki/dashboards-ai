import { NextResponse } from 'next/server';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const SYSTEM_PROMPT = `You are a secure HTML component generator. 
Respond in the following format:

HTML:
<div>your html content here</div>

Questions:
- First follow-up question
- Second follow-up question

If the user request is not related to view/component creation, respond with this text only:
I specialize in view creation. Please describe your visualization needs.

Default to a dark theme (#18181b background, #fafafa text) unless specified otherwise.
Use https://www.unpkg.com for any external resources.
All scripts must be safe, sandboxed, and self-contained.
Include responsive meta tags.
For charts, use Lightweight Charts (v4.0.0+).
If the user request is vague, include 1-2 follow-up questions, such as:
- Should the layout prioritize news or charts?
- Do you prefer a light or dark theme?
- Do you want real-time updates or static data?
`;

// Create a window object for DOMPurify
const window = new JSDOM('').window;
const purify = DOMPurify(window);

interface RequestBody {
  prompt: string;
  conversationHistory?: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
}

export async function POST(request: Request) {
  console.log('API: Received request');
  try {
    const { prompt, conversationHistory = [] } = await request.json() as RequestBody;
    console.log('API: Parsed request body', { prompt, conversationHistoryLength: conversationHistory.length });

    if (!prompt) {
      console.log('API: Error - Prompt is required');
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Prepare the conversation with system prompt
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: 'user', content: prompt },
    ];
    console.log('API: Prepared messages for Perplexity', { messageCount: messages.length });

    // Call Perplexity API directly
    console.log('API: Calling Perplexity API');
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'sonar',
        messages
      }),
    });

    if (!response.ok) {
      console.error('API: Perplexity API error', { status: response.status, statusText: response.statusText });
      throw new Error(`Perplexity API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API: Received response from Perplexity');
    const content = data.choices[0].message.content;

    // Check if it's the error message
    if (content.includes('I specialize in view creation')) {
      return NextResponse.json({
        message: content
      });
    }

    // Parse the response
    const htmlMatch = content.match(/HTML:\s*([\s\S]*?)(?=Questions:|$)/);
    const questionsMatch = content.match(/Questions:\s*([\s\S]*?)$/);

    const html = htmlMatch ? htmlMatch[1].trim() : '';
    const questions = questionsMatch 
      ? questionsMatch[1]
          .split('\n')
          .map((q: string) => q.trim())
          .filter((q: string) => q.startsWith('-'))
          .map((q: string) => q.substring(1).trim())
      : [];

    return NextResponse.json({
      html,
      questions,
    });
  } catch (error) {
    console.error('API: Error generating card:', error);
    return NextResponse.json(
      { error: 'Failed to generate card' },
      { status: 500 }
    );
  }
} 