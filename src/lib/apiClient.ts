// Session-scoped localStorage keys that must be wiped on logout or
// "switch user". User preferences (theme, locale, sidebar) deliberately
// stay on this device across logins — they belong to the browser, not
// the session. Centralizing the list here means the next person who
// adds a key can't forget to add it here.
export const SESSION_STORAGE_KEYS = [
  // assessment history (store)
  'assessmentHistory',
  // dashboard analysis cache
  'mindmirror_analysis_history_hash',
  'mindmirror_analysis_cache',
  'mindmirror_analysis_meta',
  // mood tracker
  'moodTracker_entries',
  // training
  'training_history',
  'training_progress',
  'training_schedules',
  // achievements
  'achievements_unlocked',
  // tags
  'userTags',
  // personal data center
  'personalDataCenter',
  // shareable result links
  'shared_assessment_results',
] as const;

export function clearLocalSession(): void {
  for (const key of SESSION_STORAGE_KEYS) {
    try {
      localStorage.removeItem(key);
    } catch {
      // storage may be disabled in private mode
    }
  }
}
