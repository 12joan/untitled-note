export const filterPredicate = (haystack: string, needle: string): boolean => {
  const haystackWords = haystack.split(' ');
  const needleWords = needle.split(' ');

  return needleWords.every((needleWord, i) => {
    const allowPrefix = i === needleWords.length - 1;

    return haystackWords.some((unslicedHaystackWord) => {
      const haystackWord = allowPrefix
        ? unslicedHaystackWord.slice(0, needleWord.length)
        : unslicedHaystackWord;

      return (
        haystackWord.localeCompare(needleWord, undefined, {
          usage: 'search',
          sensitivity: 'base',
        }) === 0
      );
    });
  });
};
