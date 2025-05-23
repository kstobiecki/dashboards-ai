import { NextResponse } from 'next/server';
import htmlValidator from 'html-validator';

const HTML_SYSTEM_PROMPT = `You are a secure HTML component generator. 
Respond with ONLY the HTML content, nothing else.
The HTML should be a complete, valid HTML document.
Do not include any other text or formatting like html or backticks or newlines (slash n) or similar. It has to be just the valid html.

Default to a dark theme (#18181b background, #fafafa text) unless specified otherwise.
Use https://www.unpkg.com for any external resources.
Include Tailwind CSS from https://www.unpkg.com/tailwindcss@2.2.19/dist/tailwind.min.css.
All scripts must be safe, sandboxed, and self-contained.
Include responsive meta tags.
Responsive design is important.
For charts, use Lightweight Charts (v4.0.0+).
The root element should have width: 100% and height: 100% to fill the entire parent component unless specifically requested by the user.
Do not add border radius to the root element unless specifically requested by the user.`;

const QUESTIONS_SYSTEM_PROMPT = `You are an AI assistant helping to clarify visualization requirements.
Respond with ONLY 2 follow-up questions, one per line, prefixed with a dash (-).
Do not include any other text or formatting.

Example response:
- Should the layout prioritize news or charts?
- Do you prefer a light or dark theme?`;

interface RequestBody {
  prompt: string;
  conversationHistory?: {
    prompts: string;
    html: string;
  };
}

interface Message {
  role: string;
  content: string;
}

// Helper methods
function prepareMessages(prompt: string, conversationHistory?: { prompts: string; html: string }): { htmlMessages: Message[]; questionsMessages: Message[] } {
  const userContent = conversationHistory 
    ? `new user prompt: ${prompt}${conversationHistory.html ? `\nlatest html: ${conversationHistory.html}` : ''}${conversationHistory.prompts ? `\nconversation history prompts: ${conversationHistory.prompts}` : ''}`
    : prompt;

  return {
    htmlMessages: [
      { role: 'system', content: HTML_SYSTEM_PROMPT },
      { role: 'user', content: userContent }
    ],
    questionsMessages: [
      { role: 'system', content: QUESTIONS_SYSTEM_PROMPT },
      { role: 'user', content: userContent }
    ]
  };
}

async function makePerplexityRequests(htmlMessages: Message[], questionsMessages: Message[]) {
  const [htmlResponse, questionsResponse] = await Promise.all([
    fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: htmlMessages
      }),
    }),
    fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: questionsMessages
      }),
    })
  ]);

  if (!htmlResponse.ok || !questionsResponse.ok) {
    throw new Error('Perplexity API error');
  }

  return Promise.all([htmlResponse.json(), questionsResponse.json()]);
}

async function validateHtml(html: string): Promise<boolean> {
  try {
    const validationResult = await htmlValidator({ 
      data: html,
      ignore: ['trailing-slash', 'line-endings']
    });
    
    if (validationResult.messages && validationResult.messages.length > 0) {
      console.error('API: Invalid HTML:', validationResult.messages);
      return false;
    }
    return true;
  } catch (error) {
    console.error('API: HTML validation error:', error);
    return false;
  }
}

function parseQuestions(content: string): string[] {
  return content
    .split('\n')
    .map((q: string) => q.trim())
    .filter((q: string) => q.startsWith('-'))
    .map((q: string) => q.substring(1).trim());
}

export async function POST(request: Request) {
  console.log('API: Received request');
  try {
    const { prompt, conversationHistory } = await request.json() as RequestBody;
    console.log('API: Parsed request body', { prompt, conversationHistory });

    if (!prompt) {
      console.log('API: Error - Prompt is required');
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const { htmlMessages, questionsMessages } = prepareMessages(prompt, conversationHistory);
    const [htmlData, questionsData] = await makePerplexityRequests(htmlMessages, questionsMessages);
    
    const html = htmlData.choices[0].message.content;
    
    const isValidHtml = await validateHtml(html);
    if (!isValidHtml) {
      return NextResponse.json({
        message: 'I specialize in view creation. Please describe your visualization needs.'
      });
    }

    const questions = parseQuestions(questionsData.choices[0].message.content);

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