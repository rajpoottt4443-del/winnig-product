/**
 * Robust JSON extraction and repair helper for LLM responses.
 * Handles markdown code-fencing, trailing commas, and partial wrappers.
 */
export function extractAndParseJSON<T = any>(rawText: string): T {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Empty or non-string response from AI engine.');
  }

  // Strip markdown code blocks if present
  let cleaned = rawText
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  // Attempt direct parse first
  try {
    return JSON.parse(cleaned);
  } catch (_e) {
    // Locate first { or [ and last } or ]
    const firstBrace = cleaned.indexOf('{');
    const firstBracket = cleaned.indexOf('[');
    let startIdx = -1;
    let endIdx = -1;

    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      startIdx = firstBrace;
      endIdx = cleaned.lastIndexOf('}');
    } else if (firstBracket !== -1) {
      startIdx = firstBracket;
      endIdx = cleaned.lastIndexOf(']');
    }

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      let substring = cleaned.slice(startIdx, endIdx + 1);
      // Repair common LLM JSON quirks: trailing commas before } or ]
      substring = substring.replace(/,\s*([}\]])/g, '$1');
      try {
        return JSON.parse(substring);
      } catch (_innerErr) {
        // Further cleanup of control characters inside strings
        const sanitized = substring.replace(/[\u0000-\u0019]+/g, ' ');
        return JSON.parse(sanitized);
      }
    }
    throw new Error('Failed to parse structured JSON from AI output.');
  }
}
