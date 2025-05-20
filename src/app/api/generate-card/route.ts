import { NextResponse } from 'next/server';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const SYSTEM_PROMPT = `You are a secure HTML component generator. 
Always respond in the following JSON format:

{
  "html": "valid HTML with inline CSS and JS in one file",
  "questions": ["optional array of follow-up questions"]
}

- If the user request is not related to view/component creation, respond with this string only (not JSON): 
  I specialize in view creation. Please describe your visualization needs.
- Default to a dark theme (#18181b background, #fafafa text) unless specified otherwise.
- Use https://www.unpkg.com for any external resources.
- All scripts must be safe, sandboxed, and self-contained.
- Include responsive meta tags.
- For charts, use Lightweight Charts (v4.0.0+).
- If the user request is vague, include 1-2 follow-up questions in the "questions" array, such as:
  "Should the layout prioritize news or charts?"
  "Do you prefer a light or dark theme?"
  "Do you want real-time updates or static data?"
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
        model: 'sonar-pro',
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
    
    // Parse the JSON response from Sonar
    console.log('API: Parsing JSON response');
    const parsedContent = JSON.parse(content);
    
    // Sanitize the HTML
    console.log('API: Sanitizing HTML');
    const sanitizedHtml = purify.sanitize(parsedContent.html, {
      ALLOWED_TAGS: ['div', 'p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'img', 'script', 'style', 'meta', 'link'],
      ALLOWED_ATTR: ['class', 'id', 'src', 'href', 'style', 'content', 'rel', 'type'],
    });

    console.log('API: Sending response to client');
    // Return the sanitized response
    return NextResponse.json({
      html: sanitizedHtml,
      questions: parsedContent.questions,
    });
  } catch (error) {
    console.error('API: Error generating card:', error);
    return NextResponse.json(
      { error: 'Failed to generate card' },
      { status: 500 }
    );
  }
} 