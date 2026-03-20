import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, AlertCircle, ChevronDown, ChevronUp, Key } from 'lucide-react';
import { Button, Card } from '@/components/atoms';
import { useSettingsStore } from '@/store/settingsStore';
import { buildAIReportInput } from '@/features/ai/aiInputBuilder';
import { generateAIReport, getStoredApiKey, setStoredApiKey } from '@/features/ai/aiProvider';
import { updateResultAiReport } from '@/features/storage/resultService';
import type { ResultRecord, AIReportStatus, AIReportError, AIReport } from '@/shared/types';

interface AIReportSectionProps {
  title: string;
  content: string | string[];
  defaultExpanded?: boolean;
}

const AIReportSection: FC<AIReportSectionProps> = ({ title, content, defaultExpanded = true }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const contentArray = Array.isArray(content) ? content : [content];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full py-3 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <span className="font-medium text-gray-900 dark:text-white">{title}</span>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="pb-4"
        >
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            {contentArray.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

interface AIReportDisplayProps {
  report: AIReport;
}

const AIReportDisplay: FC<AIReportDisplayProps> = ({ report }) => {
  return (
    <div className="space-y-1">
      <AIReportSection title="整体解读" content={report.overview} defaultExpanded={true} />
      <AIReportSection title="特质解读" content={report.traitReadings} defaultExpanded={true} />
      <AIReportSection title="优势分析" content={report.strengths} defaultExpanded={true} />
      <AIReportSection title="盲点提示" content={report.blindSpots} defaultExpanded={false} />
      <AIReportSection title="实践建议" content={report.practicalSuggestions} defaultExpanded={true} />
      <AIReportSection title="成长方向" content={report.growthDirections} defaultExpanded={false} />
      <AIReportSection title="注意事项" content={report.cautions} defaultExpanded={false} />
    </div>
  );
};

interface APIKeyInputProps {
  onSave: (key: string) => void;
  currentKey: string;
}

const APIKeyInput: FC<APIKeyInputProps> = ({ onSave, currentKey }) => {
  const [key, setKey] = useState(currentKey);

  const handleSave = () => {
    onSave(key);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm">
        <Key className="w-4 h-4" />
        <span>需要 API Key 才能生成 AI 分析报告</span>
      </div>
      <input
        type="password"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="输入 Anthropic API Key"
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
      <Button onClick={handleSave} disabled={!key.trim()} size="sm">
        保存 Key
      </Button>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        您的 API Key 仅存储在本地浏览器中，不会被上传到任何服务器。
      </p>
    </div>
  );
};

interface AIReportBlockProps {
  result: ResultRecord;
  resultId: number;
}

const AIReportBlock: FC<AIReportBlockProps> = ({ result, resultId }) => {
  const { aiApiKey, setAiApiKey } = useSettingsStore();
  const [status, setStatus] = useState<AIReportStatus>('idle');
  const [error, setError] = useState<AIReportError | null>(null);
  const [report, setReport] = useState<AIReport | null>(null);
  const [showKeyInput, setShowKeyInput] = useState(false);

  useEffect(() => {
    if (result.aiAnalysis) {
      try {
        const parsed = JSON.parse(result.aiAnalysis);
        if (parsed.report && parsed.metadata) {
          setReport(parsed.report);
          setStatus('success');
        }
      } catch {
        console.warn('Failed to parse existing AI analysis');
      }
    }
  }, [result.aiAnalysis]);

  const handleGenerate = async () => {
    const effectiveKey = aiApiKey || getStoredApiKey();

    if (!effectiveKey) {
      setShowKeyInput(true);
      return;
    }

    setStatus('loading');
    setError(null);

    try {
      const input = buildAIReportInput(result);
      const generatedReport = await generateAIReport(input, effectiveKey);

      const reportRecord = {
        report: generatedReport,
        metadata: {
          provider: 'anthropic',
          model: 'claude-sonnet-4-20250514',
          generatedAt: new Date().toISOString(),
          assessmentSlug: result.assessmentSlug,
          resultType: result.resultType,
        },
      };

      await updateResultAiReport(resultId, reportRecord);
      setReport(generatedReport);
      setStatus('success');
      setShowKeyInput(false);
    } catch (err) {
      const aiError = err as AIReportError;
      setError(aiError);
      setStatus('error');

      if (aiError.code === 'NO_API_KEY' || aiError.code === 'INVALID_KEY') {
        setShowKeyInput(true);
      }
    }
  };

  const handleKeySave = (key: string) => {
    setAiApiKey(key);
    setStoredApiKey(key);
    setShowKeyInput(false);
    handleGenerate();
  };

  const handleRetry = () => {
    setError(null);
    handleGenerate();
  };

  if (status === 'idle') {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">AI 增强分析报告</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">基于您的测评结果生成个性化深度解读</p>
          </div>
        </div>
        {showKeyInput ? (
          <APIKeyInput onSave={handleKeySave} currentKey={aiApiKey || ''} />
        ) : (
          <Button onClick={handleGenerate} leftIcon={<Sparkles className="w-4 h-4" />}>
            生成 AI 报告
          </Button>
        )}
      </Card>
    );
  }

  if (status === 'loading') {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">AI 增强分析报告</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">正在生成深度解读...</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className="text-sm">AI 正在分析您的性格特质，请稍候...</span>
        </div>
      </Card>
    );
  }

  if (status === 'error') {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">AI 增强分析报告</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">生成失败</p>
          </div>
        </div>
        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 mb-4">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">
              {error?.code === 'NO_API_KEY' && '请提供 API Key'}
              {error?.code === 'INVALID_KEY' && 'API Key 无效或已过期'}
              {error?.code === 'NETWORK_ERROR' && '网络连接失败'}
              {error?.code === 'PARSE_ERROR' && 'AI 返回格式解析失败'}
              {error?.code === 'UNKNOWN_ERROR' && '发生未知错误'}
            </p>
            {error?.message && (
              <p className="text-xs mt-1 opacity-80">{error.message}</p>
            )}
          </div>
        </div>
        {showKeyInput ? (
          <APIKeyInput onSave={handleKeySave} currentKey={aiApiKey || ''} />
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleRetry} leftIcon={<RefreshCw className="w-4 h-4" />}>
              重试
            </Button>
            <Button variant="ghost" onClick={() => setShowKeyInput(true)}>
              配置 API Key
            </Button>
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">AI 增强分析报告</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              基于 {result.resultType} · {result.resultProfileName}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRetry}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          重新生成
        </Button>
      </div>
      <AIReportDisplay report={report!} />
    </Card>
  );
};

export default AIReportBlock;
