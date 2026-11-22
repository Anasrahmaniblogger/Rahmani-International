import { ThinkingLevel } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient } from '@/lib/gemini';

interface AdvisorRequestBody {
  prompt?: unknown;
  mode?: unknown;
}

interface CitationItem {
  title: string;
  uri: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AdvisorRequestBody;
    const rawPrompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    const mode = body.mode === 'thinking' ? 'thinking' : 'search';

    if (rawPrompt.length < 4) {
      return NextResponse.json(
        { error: 'Please enter a technical question of at least 4 characters.' },
        { status: 400 }
      );
    }

    if (rawPrompt.length > 1200) {
      return NextResponse.json(
        { error: 'Please keep your query under 1,200 characters.' },
        { status: 400 }
      );
    }

    const ai = getGeminiClient();
    if (!ai) {
      return NextResponse.json(
        {
          error:
            'Gemini API key is not configured in the server environment. Configure GEMINI_API_KEY in Vercel or Settings > Secrets to enable live research and reasoning.',
        },
        { status: 503 }
      );
    }

    const systemInstruction =
      mode === 'search'
        ? 'You are a concise technical research assistant for Rahmani International (rahmaniinternational.in), a publisher of Android apps and modern Next.js websites. Use Google Search grounding to provide accurate, up-to-date answers about Google Play Console policies, Android SDK targets, Next.js/Vercel deployment, SEO, or privacy compliance. Respond in clean Markdown with short headings and bullet points. Never fabricate company contact details or unverified privacy practices.'
        : 'You are a senior mobile and web systems architect assisting Rahmani International (rahmaniinternational.in). Think deeply to produce structured, practical engineering recommendations covering Android publishing, Play Console compliance checklists, static Next.js architecture on Vercel, security hardening, and product UX. Respond in clear, actionable Markdown.';

    const response =
      mode === 'search'
        ? await ai.models.generateContent({
            model: 'gemini-4-hydrogen',
            contents: rawPrompt,
            config: {
              systemInstruction,
              tools: [{ googleSearch: {} }],
            },
          })
        : await ai.models.generateContent({
            model: 'gemini-4-hydrogen',
            contents: rawPrompt,
            config: {
              systemInstruction,
              thinkingConfig: {
                thinkingLevel: ThinkingLevel.HIGH,
              },
            },
          });

    const text = response.text?.trim() ?? '';
    if (!text) {
      return NextResponse.json(
        { error: 'No response was returned by the model. Please try again.' },
        { status: 502 }
      );
    }

    const rawChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const seen = new Set<string>();
    const citations: CitationItem[] = [];

    for (const chunk of rawChunks) {
      const uri = chunk.web?.uri;
      if (uri && /^https?:\/\//i.test(uri) && !seen.has(uri)) {
        seen.add(uri);
        citations.push({
          title: chunk.web?.title || uri,
          uri,
        });
      }
    }

    return NextResponse.json({
      text,
      mode,
      model: 'gemini-4-hydrogen',
      citations,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Unexpected server error.';
    const status = message.includes('429')
      ? 429
      : message.includes('403') || message.includes('API_KEY')
        ? 403
        : 500;

    return NextResponse.json(
      {
        error:
          status === 429
            ? 'API quota limit reached. Please try again shortly or check your API key tier.'
            : status === 403
              ? 'API key permission error. Please verify GEMINI_API_KEY in Settings > Secrets.'
              : `Unable to complete request: ${message}`,
      },
      { status }
    );
  }
}
