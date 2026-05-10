export * from './theories/mbti-theory'
export * from './theories/learning-styles-theory'
export * from './theories/bigfive-theory'
export * from './theories/emotional-intelligence-theory'
export * from './theories/attachment-theory'
export * from './guides/how-to-read-report'

export { default as MBTI_KNOWLEDGE } from './theories/mbti-theory'
export { LEARNING_STYLES_THEORY } from './theories/learning-styles-theory'
export { BIG_FIVE_THEORY } from './theories/bigfive-theory'
export { EMOTIONAL_INTELLIGENCE_THEORY } from './theories/emotional-intelligence-theory'
export { ATTACHMENT_THEORY } from './theories/attachment-theory'
export { HOW_TO_READ_REPORT_GUIDE } from './guides/how-to-read-report'

export type { TypeProfile } from './theories/mbti-theory'
export type { LearningStyleProfile } from './theories/learning-styles-theory'
export type { BigFiveDimension, BigFiveTheoryContent } from './theories/bigfive-theory'
export type { EIDimension, EmotionalIntelligenceTheoryContent } from './theories/emotional-intelligence-theory'
export type { AttachmentStyle, AttachmentTheoryContent } from './theories/attachment-theory'
export type { HowToReadReportGuideContent } from './guides/how-to-read-report'

import { getMBTITheory } from './theories/mbti-theory'
import { getLearningStyleTheory } from './theories/learning-styles-theory'
import { getBigFiveDimension } from './theories/bigfive-theory'
import { getEIDimension } from './theories/emotional-intelligence-theory'
import { getAttachmentStyle } from './theories/attachment-theory'

export type AssessmentType = 'mbti' | 'learning-style' | 'big-five' | 'dark-triad' | 'iq' | 'eq' | 'attachment'

export function getKnowledgeForResult(
  assessmentId: string,
  result: Record<string, any>
) {
  try {
    if (!assessmentId || !result) {
      return null
    }

    const typeMatch = String(assessmentId).toLowerCase()
    
    if (typeMatch.includes('mbti') || typeMatch.includes('sbti') || typeMatch.includes('16personalities')) {
      const typeCode = result.type || (result.dimension?.type)
      if (typeCode) {
        const profile = getMBTITheory(typeCode)
        if (profile) {
          return {
            type: 'mbti',
            profile
          }
        }
      }
    }
    
    if (typeMatch.includes('kolb') || typeMatch.includes('learning') || typeMatch.includes('学习')) {
      let typeCode = result.type || (result.learningStyle?.type) || (result.style?.type)
      if (!typeCode && result.preference) {
        typeCode = result.preference.type
      }
      if (typeCode) {
        const profile = getLearningStyleTheory(typeCode)
        if (profile) {
          return {
            type: 'learning-style',
            profile
          }
        }
      }
    }

    if (typeMatch.includes('bigfive') || typeMatch.includes('big-five') || typeMatch.includes('五因素')) {
      const dimCode = result.dimension || result.highestDimension
      if (dimCode) {
        const profile = getBigFiveDimension(dimCode)
        if (profile) {
          return {
            type: 'bigfive',
            profile
          }
        }
      }
    }

    if (typeMatch.includes('eq') || typeMatch.includes('emotional') || typeMatch.includes('情商')) {
      const dimCode = result.dimension || result.lowestDimension
      if (dimCode) {
        const profile = getEIDimension(dimCode)
        if (profile) {
          return {
            type: 'eq',
            profile
          }
        }
      }
    }

    if (typeMatch.includes('attachment') || typeMatch.includes('依恋')) {
      const styleCode = result.style || result.type
      if (styleCode) {
        const profile = getAttachmentStyle(styleCode)
        if (profile) {
          return {
            type: 'attachment',
            profile
          }
        }
      }
    }
  } catch (e) {
    console.warn('知识库检索失败:', e)
  }
  
  return null
}

