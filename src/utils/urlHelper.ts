let baseUrl = "";

export const setBaseUrl = (base: string) => {
  baseUrl = base;
};

export const getBaseUrl = (path: string = "") => {
  if (baseUrl) return new URL(path, baseUrl).toString();
  return path;
};

export const getUrlParamValue = (param: string) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};
