export const getMaskByRatio = (ratio: '9:16' | '1:1' | '16:9') => {
  switch (ratio) {
    case '9:16':
      return null;

    case '1:1':
      return {
        width: 1,
        height: 9 / 16,
      };

    case '16:9':
      return {
        width: 1,
        height: 9 / 16 / (16 / 9),
      };
  }
};
