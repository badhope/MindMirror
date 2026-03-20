import type { AIReportInput } from '@/shared/types/aiReport';
import type { ResultRecord } from '@/shared/types';

export function buildMBTIReportInput(result: ResultRecord): AIReportInput {
  const eiScore = result.normalizedScores?.EI ?? result.rawScores?.EI ?? 0;
  const snScore = result.normalizedScores?.SN ?? result.rawScores?.SN ?? 0;
  const tfScore = result.normalizedScores?.TF ?? result.rawScores?.TF ?? 0;
  const jpScore = result.normalizedScores?.JP ?? result.rawScores?.JP ?? 0;

  return {
    assessmentId: result.assessmentId,
    assessmentName: result.assessmentName,
    assessmentSlug: result.assessmentSlug,
    category: result.category,
    resultType: result.resultType,
    resultProfileId: result.resultProfileId,
    resultProfileName: result.resultProfileName,
    summary: result.summary,
    highlights: result.highlights || [],
    recommendations: result.recommendations || [],
    rawScores: result.rawScores || {},
    normalizedScores: result.normalizedScores || {},
    dimensionScores: {
      EI: eiScore,
      SN: snScore,
      TF: tfScore,
      JP: jpScore,
    },
    mbtiType: result.resultType,
    eiScore,
    snScore,
    tfScore,
    jpScore,
  };
}

export function buildGenericReportInput(result: ResultRecord): AIReportInput {
  return {
    assessmentId: result.assessmentId,
    assessmentName: result.assessmentName,
    assessmentSlug: result.assessmentSlug,
    category: result.category,
    resultType: result.resultType,
    resultProfileId: result.resultProfileId,
    resultProfileName: result.resultProfileName,
    summary: result.summary,
    highlights: result.highlights || [],
    recommendations: result.recommendations || [],
    rawScores: result.rawScores || {},
    normalizedScores: result.normalizedScores || {},
  };
}

export function buildAIReportInput(result: ResultRecord): AIReportInput {
  if (result.assessmentSlug === 'mbti-basic') {
    return buildMBTIReportInput(result);
  }
  return buildGenericReportInput(result);
}
