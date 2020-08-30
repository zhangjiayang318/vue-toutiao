export const getItem = (key) => {
  const value = window.localStorage.getItem(key);
  if (value) {
    return JSON.parse(value);
  } else {
    return value;
  }
};
export const setItem = (key, value) => {
  if (typeof value === "object") {
    value = JSON.stringify(value);
  }
  window.localStorage.setItem(key, value);
};
export const removeItem = (key) => {
  window.localStorage.removeItem(key);
};
