export const getItem = key => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error("error:", error);
    return null;
  }
};

export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error("error:", error);
    return null;
  }
};
