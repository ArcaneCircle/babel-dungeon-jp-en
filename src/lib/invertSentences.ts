import { SENTENCES } from "~/lib/sentences";

/**
 * Inverts the SENTENCES array from LANG1->LANG2 to LANG2->LANG1
 * Groups sentences by their shared meanings.
 *
 * Example:
 * Input:  ["S1\tM1|M2", "S2\tM1|M3"]
 * Output: ["M1\tS1|S2", "M2\tS1", "M3\tS2"]
 */
function invertSentencesArray(sentences: string[]): string[] {
  const meaningToSentences = new Map<string, Set<string>>();

  // Build a map of meaning -> set of sentences that have that meaning
  for (const line of sentences) {
    const [sentence, meaningsStr] = line.split("\t");
    if (!sentence || !meaningsStr) continue;

    const meanings = meaningsStr.split("|");
    for (const meaning of meanings) {
      const trimmedMeaning = meaning.trim();
      if (!trimmedMeaning) continue;

      if (!meaningToSentences.has(trimmedMeaning)) {
        meaningToSentences.set(trimmedMeaning, new Set());
      }
      meaningToSentences.get(trimmedMeaning)!.add(sentence.trim());
    }
  }

  // Convert the map to an array of strings in the same format
  return Array.from(meaningToSentences.entries()).map(
    ([meaning, sentences]) => {
      return `${meaning}\t${Array.from(sentences).join("|")}`;
    },
  );
}

/**
 * Initializes the SENTENCES array based on learning language.
 * Must be called once at app startup.
 * Replaces SENTENCES in-place if learning LANG2.
 */
export function initializeSentences(learningLang: string): void {
  if (learningLang === "LANG2") {
    const inverted = invertSentencesArray(SENTENCES);
    SENTENCES.length = 0;
    SENTENCES.push(...inverted);
  }
}
