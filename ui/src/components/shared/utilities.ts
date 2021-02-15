export const wait = async (timeout = 1000) => {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      if (timer) {
        clearTimeout(timer);
      }
      return resolve(true);
    }, timeout);
  });
};
