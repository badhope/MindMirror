import QRCode from 'qrcode';
import { storage } from '../../lib/utils';

const SHARED_RESULTS_KEY = 'shared_assessment_results';

export type ExportFormat = 'pdf' | 'markdown' | 'text' | 'json' | 'html';

export interface ExportOptions {
  includeRawData?: boolean;
  includeCharts?: boolean;
  includeTrace?: boolean;
  watermark?: string;
  language?: 'en' | 'zh';
}

export interface ShareOptions {
  expirationHours?: number;
  viewLimit?: number;
  password?: string;
  includeFullReport?: boolean;
  language?: 'en' | 'zh';
}

export interface SharedResult {
  id: string;
  resultId: string;
  data: any;
  createdAt: number;
  expiresAt?: number;
  views: number;
  maxViews?: number;
  passwordHash?: string;
  hash?: string;
}

const LABELS = {
  zh: {
    title: '心理测评报告',
    type: '测评类型',
    time: '测评时间',
    totalScore: '总分',
    traits: '特质得分',
    summary: '详细报告',
    raw: '原始数据',
    unknown: '未知',
    question: '题',
  },
  en: {
    title: 'Assessment Report',
    type: 'Assessment',
    time: 'Completed at',
    totalScore: 'Total Score',
    traits: 'Trait Scores',
    summary: 'Detailed Report',
    raw: 'Raw Data',
    unknown: 'Unknown',
    question: 'Q',
  },
};

// 测评 ID → 友好显示名 (zh / en)
// 用于 HTML 报告中显示测评的正式名称,而不是冷冰冰的 id 字符串
const ASSESSMENT_LABELS: Record<'zh' | 'en', Record<string, string>> = {
  zh: {
    'big-five': '大五人格',
    'stress-test': '压力测试',
    'anxiety-gad7': '焦虑测评 (GAD-7)',
    'social-support': '社会支持 (SSRS)',
    'mbi-burnout': '职业倦怠 (MBI-GS)',
    'life-satisfaction': '生活满意度 (SWLS)',
    'resilience-cdrisc': '心理韧性 (CD-RISC-10)',
  },
  en: {
    'big-five': 'Big Five Personality',
    'stress-test': 'Stress Test',
    'anxiety-gad7': 'Anxiety (GAD-7)',
    'social-support': 'Social Support (SSRS)',
    'mbi-burnout': 'Burnout (MBI-GS)',
    'life-satisfaction': 'Life Satisfaction (SWLS)',
    'resilience-cdrisc': 'Resilience (CD-RISC-10)',
  },
};

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function sha256Hex(input: string): Promise<string> {
  // Fail closed if WebCrypto is unavailable. A non-cryptographic fallback
  // here would let an attacker brute-force a 4-character share password
  // in milliseconds, so we don't ship one.
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    throw new Error('WebCrypto is not available; share password protection is disabled.');
  }
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function buildReportHtml(result: any, lang: 'en' | 'zh' = 'zh'): string {
  const t = LABELS[lang];
  // 兼容多种字段名: 优先 result.title, 否则 assessmentTitle, 最后默认
  const title = result.title || result.assessmentTitle || t.title;
  const assessmentId = result.assessmentId || t.unknown;
  const assessmentLabel = ASSESSMENT_LABELS[lang][assessmentId] || assessmentId;
  const time = new Date(result.timestamp || result.completedAt || Date.now()).toLocaleString(
    lang === 'zh' ? 'zh-CN' : 'en-US'
  );
  const totalScore = result.totalScore ?? 0;
  const traitsHtml = (result.traits || [])
    .map(
      (trait: { name: string; score: number; description?: string }) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-weight:600;">${escapeHtml(trait.name)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${trait.score}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#475569;">${escapeHtml(trait.description || '')}</td>
      </tr>`
    )
    .join('');

  const summary = result.report?.summary || result.report?.analysis || '';
  const html = `<!DOCTYPE html>
<html lang="${lang === 'zh' ? 'zh-CN' : 'en'}">
<head>
<meta charset="UTF-8" />
<title>${escapeHtml(title)}</title>
<style>
  body { font-family: -apple-system, "PingFang SC", "Microsoft YaHei", Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 24px; color: #1e293b; line-height: 1.6; }
  h1 { font-size: 28px; border-bottom: 2px solid #4f46e5; padding-bottom: 8px; }
  .meta { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px 24px; margin: 16px 0 24px; }
  .meta div { padding: 8px 12px; background: #f8fafc; border-radius: 8px; }
  .meta-label { font-size: 12px; color: #64748b; }
  .meta-value { font-weight: 600; }
  table { width: 100%; border-collapse: collapse; margin-top: 16px; }
  thead { background: #eef2ff; }
  th { padding: 10px 12px; text-align: left; }
  .summary { background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 16px; border-radius: 8px; margin: 24px 0; white-space: pre-wrap; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #94a3b8; text-align: center; }
  @media print { body { margin: 0; } }
</style>
</head>
<body>
  <h1>📊 ${escapeHtml(title)}</h1>
  <div class="meta">
    <div><div class="meta-label">${t.type}</div><div class="meta-value">${escapeHtml(assessmentLabel)}</div></div>
    <div><div class="meta-label">${t.time}</div><div class="meta-value">${escapeHtml(time)}</div></div>
    <div><div class="meta-label">${t.totalScore}</div><div class="meta-value">${totalScore}</div></div>
  </div>
  ${
    traitsHtml
      ? `<table>
    <thead><tr><th>${t.traits}</th><th style="text-align:right;">${t.totalScore}</th><th>${t.summary}</th></tr></thead>
    <tbody>${traitsHtml}</tbody>
  </table>`
      : ''
  }
  ${summary ? `<div class="summary">${escapeHtml(summary)}</div>` : ''}
  <div class="footer">MindMirror · github.com/badhope/mindmirror</div>
</body>
</html>`;
  return html;
}

export class ExportService {
  async exportToText(result: any, options: ExportOptions = {}): Promise<string> {
    const lang = options.language || 'zh';
    const t = LABELS[lang];
    const lines = [
      `# ${result.title || result.assessmentTitle || t.title}`,
      '',
      `${t.type}: ${result.assessmentId || t.unknown}`,
      `${t.time}: ${new Date(result.timestamp || result.completedAt || Date.now()).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US')}`,
      `${t.totalScore}: ${result.totalScore || 0}`,
      '',
      '---',
      '',
      `## ${t.traits}`,
      '',
    ];

    if (result.traits) {
      for (const trait of result.traits) {
        lines.push(`- ${trait.name}: ${trait.score}`);
        if (trait.description) {
          lines.push(`  ${trait.description}`);
        }
        lines.push('');
      }
    }

    if (result.report) {
      lines.push(`## ${t.summary}`);
      lines.push('');
      if (result.report.summary) lines.push(result.report.summary);
      if (result.report.analysis) lines.push(result.report.analysis);
    }

    if (options.includeRawData && result.rawAnswers) {
      lines.push('');
      lines.push(`## ${t.raw}`);
      lines.push(JSON.stringify(result.rawAnswers, null, 2));
    }

    return lines.join('\n');
  }

  async exportToMarkdown(result: any, options: ExportOptions = {}): Promise<string> {
    return this.exportToText(result, options);
  }

  async exportToJSON(result: any, options: ExportOptions = {}): Promise<string> {
    const data: any = {
      id: result.id,
      title: result.title || result.assessmentTitle,
      assessmentId: result.assessmentId,
      timestamp:
        result.timestamp ||
        (result.completedAt ? new Date(result.completedAt).getTime() : undefined),
      totalScore: result.totalScore,
      traits: result.traits,
      generatedAt: new Date().toISOString(),
    };

    if (options.includeRawData) {
      data.rawAnswers = result.rawAnswers;
    }

    return JSON.stringify(data, null, 2);
  }

  async exportToHTML(result: any, options: ExportOptions = {}): Promise<string> {
    return buildReportHtml(result, options.language || 'zh');
  }

  async exportToPDF(result: any, options: ExportOptions = {}): Promise<Blob> {
    const html = buildReportHtml(result, options.language || 'zh');
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    return blob;
  }

  async download(result: any, format: ExportFormat, options: ExportOptions = {}): Promise<void> {
    let content: string | Blob;
    let filename: string;
    let mimeType: string;

    switch (format) {
      case 'text':
        content = await this.exportToText(result, options);
        filename = `assessment_${result.id}.txt`;
        mimeType = 'text/plain;charset=utf-8';
        break;
      case 'markdown':
        content = await this.exportToMarkdown(result, options);
        filename = `assessment_${result.id}.md`;
        mimeType = 'text/markdown;charset=utf-8';
        break;
      case 'json':
        content = await this.exportToJSON(result, options);
        filename = `assessment_${result.id}.json`;
        mimeType = 'application/json';
        break;
      case 'html':
        content = await this.exportToHTML(result, options);
        filename = `assessment_${result.id}.html`;
        mimeType = 'text/html;charset=utf-8';
        break;
      case 'pdf':
        content = await this.exportToPDF(result, options);
        filename = `assessment_${result.id}.html`;
        mimeType = 'text/html;charset=utf-8';
        break;
    }

    this.triggerDownload(content, filename, mimeType);
  }

  private triggerDownload(content: string | Blob, filename: string, mimeType: string): void {
    const blob = typeof content === 'string' ? new Blob([content], { type: mimeType }) : content;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export class ShareService {
  async createShareLink(result: any, options: ShareOptions = {}): Promise<string> {
    // 128 bits of entropy from the platform CSPRNG. Share IDs only need
    // to be unguessable to other browsers in offline mode, but using
    // crypto.getRandomValues() also future-proofs us if these ever
    // become server-issued.
    const idBytes = new Uint8Array(16);
    if (typeof crypto === 'undefined' || !crypto.getRandomValues) {
      throw new Error('WebCrypto is not available; share links are disabled.');
    }
    crypto.getRandomValues(idBytes);
    const shareId =
      'share_' +
      Array.from(idBytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    const data = this.prepareShareData(result, options);
    const hash = await sha256Hex(JSON.stringify(data));

    const sharedResult: SharedResult = {
      id: shareId,
      resultId: result.id,
      data,
      createdAt: Date.now(),
      views: 0,
      hash,
    };

    if (options.expirationHours) {
      sharedResult.expiresAt = Date.now() + options.expirationHours * 60 * 60 * 1000;
    }

    if (options.viewLimit) {
      sharedResult.maxViews = options.viewLimit;
    }

    if (options.password) {
      sharedResult.passwordHash = await sha256Hex(options.password);
    }

    const sharedResults = this.loadSharedResults();
    sharedResults[shareId] = sharedResult;
    this.saveSharedResults(sharedResults);

    return `${window.location.origin}/shared/${shareId}`;
  }

  async generateQRCode(shareUrl: string, size: number = 256): Promise<string> {
    try {
      const dataUrl = await QRCode.toDataURL(shareUrl, {
        width: size,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: { dark: '#1e293b', light: '#ffffff' },
      });
      return dataUrl;
    } catch (err) {
      console.error('QR generation failed:', err);
      return '';
    }
  }

  async getSharedResult(shareId: string, password?: string): Promise<SharedResult | null> {
    const sharedResults = this.loadSharedResults();
    const result = sharedResults[shareId];

    if (!result) return null;
    if (result.expiresAt && Date.now() > result.expiresAt) return null;
    if (result.maxViews && result.views >= result.maxViews) return null;
    if (result.passwordHash) {
      if (!password) return null;
      const inputHash = await sha256Hex(password);
      if (inputHash !== result.passwordHash) return null;
    }

    result.views++;
    this.saveSharedResults(sharedResults);
    return result;
  }

  verifyShare(shareId: string): boolean {
    const sharedResults = this.loadSharedResults();
    const result = sharedResults[shareId];

    if (!result) return false;
    if (result.expiresAt && Date.now() > result.expiresAt) return false;
    if (result.maxViews && result.views >= result.maxViews) return false;
    return true;
  }

  getShareStats(shareId: string): { views: number; createdAt: number } | null {
    const sharedResults = this.loadSharedResults();
    const result = sharedResults[shareId];
    if (!result) return null;
    return { views: result.views, createdAt: result.createdAt };
  }

  deleteShare(shareId: string): boolean {
    const sharedResults = this.loadSharedResults();
    if (sharedResults[shareId]) {
      delete sharedResults[shareId];
      this.saveSharedResults(sharedResults);
      return true;
    }
    return false;
  }

  async generateVerificationHash(data: any): Promise<string> {
    return sha256Hex(JSON.stringify(data));
  }

  private prepareShareData(result: any, _options: ShareOptions): any {
    return {
      id: result.id,
      title: result.title || result.assessmentTitle,
      assessmentId: result.assessmentId,
      totalScore: result.totalScore,
      traits: result.traits,
      summary: result.report?.summary,
      sharedAt: Date.now(),
    };
  }

  private loadSharedResults(): Record<string, SharedResult> {
    return storage.get<Record<string, SharedResult>>(SHARED_RESULTS_KEY, {});
  }

  private saveSharedResults(results: Record<string, SharedResult>): void {
    storage.set(SHARED_RESULTS_KEY, results);
  }
}

export const exportService = new ExportService();
export const shareService = new ShareService();
