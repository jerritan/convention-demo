export const findFirstKeyMatch = (
  input: string,
  keys: string[]
): string | null => {
  // Normalize the input to ensure consistent matching.
  // Assume Keys are all UpperCase
  const normalizedInput = input.toUpperCase();

  // Iterate over the keys to find the first match.
  for (const key of keys) {
    if (normalizedInput.includes(key)) {
      return key;
    }
  }

  // Return null if no match is found.
  return null;
};
