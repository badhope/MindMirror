import type { AIReport, AIReportInput, AIReportError } from '@/shared/types/aiReport';

const API_KEY_STORAGE_KEY = 'humandos_ai_api_key';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

export function getStoredApiKey(): string | null {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
}

export function setStoredApiKey(key: string): void {
  localStorage.setItem(API_KEY_STORAGE_KEY, key);
}

export function clearStoredApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
}

export function hasApiKey(): boolean {
  const key = getStoredApiKey();
  return !!key && key.length > 0;
}

interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AnthropicResponse {
  content: Array<{ type: string; text?: string }>;
  error?: {
    type: string;
    message: string;
  };
}

function buildMBTISystemPrompt(): string {
  return `你是一位专业的性格心理学分析助手。基于MBTI测评结果，为用户提供结构化、专业的分析报告。

【输出结构】
必须严格按以下JSON格式输出，不要添加任何额外文字：
{
  "overview": "整体解读（1段）",
  "traitReadings": ["倾向解读1", "倾向解读2", "倾向解读3", "倾向解读4"],
  "strengths": ["优势1", "优势2", "优势3", "优势4", "优势5"],
  "blindSpots": ["盲点1", "盲点2", "盲点3", "盲点4"],
  "practicalSuggestions": ["建议1", "建议2", "建议3", "建议4", "建议5"],
  "growthDirections": ["成长方向1", "成长方向2", "成长方向3", "成长方向4"],
  "cautions": ["边界提醒1", "边界提醒2"]
}

【表达原则】
- 专业、清晰、温和
- 不绝对化，使用"倾向""可能""常见表现为"等表达
- 不神神叨叨，不临床化
- 不胡乱夸张或下定论
- 重点解释：该类型在现实中的典型表现、优势体现、盲点、协作注意点、成长建议

【用户信息】
将根据提供的测评结果数据生成个性化报告。`;
}

function buildMBTIUserPrompt(input: AIReportInput): string {
  const dimensionDescriptions: Record<string, string> = {
    EI: input.eiScore !== undefined ? (input.eiScore >= 0 ? '外向(E)倾向' : '内向(I)倾向') : '未明确',
    SN: input.snScore !== undefined ? (input.snScore >= 0 ? '直觉(N)倾向' : '感觉(S)倾向') : '未明确',
    TF: input.tfScore !== undefined ? (input.tfScore >= 0 ? '思考(T)倾向' : '情感(F)倾向') : '未明确',
    JP: input.jpScore !== undefined ? (input.jpScore >= 0 ? '判断(J)倾向' : '知觉(P)倾向') : '未明确',
  };

  const highlights = input.highlights.map(h => `- ${h.text}`).join('\n');
  const recommendations = input.recommendations.map(r => `- ${r.text}`).join('\n');

  return `请为以下MBTI测评结果生成分析报告：

【基本信息】
- 人格类型：${input.mbtiType || input.resultType}
- 类型名称：${input.resultProfileName}
- 测评名称：${input.assessmentName}

【维度分数】
- 能量倾向(EI)：${dimensionDescriptions.EI} (原始分数: ${input.eiScore?.toFixed(2) ?? 'N/A'})
- 感知倾向(SN)：${dimensionDescriptions.SN} (原始分数: ${input.snScore?.toFixed(2) ?? 'N/A'})
- 判断倾向(TF)：${dimensionDescriptions.TF} (原始分数: ${input.tfScore?.toFixed(2) ?? 'N/A'})
- 生活态度(JP)：${dimensionDescriptions.JP} (原始分数: ${input.jpScore?.toFixed(2) ?? 'N/A'})

【类型简介】
${input.summary}

【突出特质】
${highlights || '暂无'}

【建议】
${recommendations || '暂无'}

请严格按照JSON格式输出分析报告。`;
}

function parseAIResponse(text: string): AIReport {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('无法解析AI返回内容');
  }

  const parsed = JSON.parse(jsonMatch[0]);

  return {
    overview: parsed.overview || '',
    traitReadings: parsed.traitReadings || [],
    strengths: parsed.strengths || [],
    blindSpots: parsed.blindSpots || [],
    practicalSuggestions: parsed.practicalSuggestions || [],
    growthDirections: parsed.growthDirections || [],
    cautions: parsed.cautions || [],
  };
}

export async function generateAIReport(
  input: AIReportInput,
  apiKey: string
): Promise<AIReport> {
  if (!apiKey) {
    const error: AIReportError = {
      code: 'NO_API_KEY',
      message: 'API key is required to generate AI report',
    };
    throw error;
  }

  const systemPrompt = buildMBTISystemPrompt();
  const userPrompt = buildMBTIUserPrompt(input);

  const messages: AnthropicMessage[] = [
    { role: 'user', content: userPrompt },
  ];

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: systemPrompt,
        messages,
      }),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        const error: AIReportError = {
          code: 'INVALID_KEY',
          message: 'API key is invalid or expired',
        };
        throw error;
      }
      const error: AIReportError = {
        code: 'NETWORK_ERROR',
        message: `API request failed: ${response.status}`,
      };
      throw error;
    }

    const data: AnthropicResponse = await response.json();

    if (data.error) {
      const error: AIReportError = {
        code: 'UNKNOWN_ERROR',
        message: data.error.message || 'Unknown API error',
      };
      throw error;
    }

    const textContent = data.content?.[0]?.text;
    if (!textContent) {
      const error: AIReportError = {
        code: 'PARSE_ERROR',
        message: 'Empty response from API',
      };
      throw error;
    }

    return parseAIResponse(textContent);
  } catch (err) {
    if ((err as AIReportError).code) {
      throw err;
    }
    const error: AIReportError = {
      code: 'NETWORK_ERROR',
      message: err instanceof Error ? err.message : 'Network error occurred',
    };
    throw error;
  }
}
