import { NextResponse } from 'next/server';
import htmlValidator from 'html-validator';

const HTML_SYSTEM_PROMPT = `You are a secure HTML component generator. 
Respond with ONLY the HTML content, nothing else.
The HTML should be a complete, valid HTML document.
Do not include any other text or formatting like html or backticks or newlines (slash n) or similar. It has to be just the valid html.

Default to a dark theme (#18181b background, #fafafa text) unless specified otherwise.
Use https://www.unpkg.com for any external resources.
All scripts must be safe, sandboxed, and self-contained.
Include responsive meta tags.
Responsive design is important.
For charts, use Lightweight Charts (v4.0.0+).`;

const QUESTIONS_SYSTEM_PROMPT = `You are an AI assistant helping to clarify visualization requirements.
Respond with ONLY 2 follow-up questions, one per line, prefixed with a dash (-).
Do not include any other text or formatting.

Example response:
- Should the layout prioritize news or charts?
- Do you prefer a light or dark theme?`;

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

    // Prepare messages for both calls
    const htmlMessages = [
      { role: 'system', content: HTML_SYSTEM_PROMPT },
      ...conversationHistory,
      { role: 'user', content: prompt },
    ];

    const questionsMessages = [
      { role: 'system', content: QUESTIONS_SYSTEM_PROMPT },
      ...conversationHistory,
      { role: 'user', content: prompt },
    ];

    // Make parallel API calls
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
      console.error('API: Perplexity API error', { 
        htmlStatus: htmlResponse.status, 
        questionsStatus: questionsResponse.status 
      });
      throw new Error('Perplexity API error');
    }

    const [htmlData, questionsData] = await Promise.all([
      htmlResponse.json(),
      questionsResponse.json()
    ]);

    const html = htmlData.choices[0].message.content;
    
    // Validate HTML
    try {
      const validationResult = await htmlValidator({ data: html });
      
      if (validationResult.messages && validationResult.messages.length > 0) {
        console.error('API: Invalid HTML:', validationResult.messages);
        return NextResponse.json({
          message: 'I specialize in view creation. Please describe your visualization needs.'
        });
      }
    } catch (error) {
      console.error('API: HTML validation error:', error);
      return NextResponse.json({
        message: 'I specialize in view creation. Please describe your visualization needs.'
      });
    }

    const questions = questionsData.choices[0].message.content
      .split('\n')
      .map((q: string) => q.trim())
      .filter((q: string) => q.startsWith('-'))
      .map((q: string) => q.substring(1).trim());

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