const toUrlParams = (params: object) =>
  Object.entries(params)
    .map(([key, value]) => `${key}=${Array.isArray(value) ? value.join(",") : value}`)
    .join("&");

export { toUrlParams };
