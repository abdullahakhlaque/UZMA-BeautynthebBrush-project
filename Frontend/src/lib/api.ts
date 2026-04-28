const ABSOLUTE_URL_PATTERN = /^(?:[a-z]+:)?\/\//i;
const DEFAULT_DEV_API_URL = "http://localhost:5000";

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const runtimeOrigin =
  typeof window !== "undefined" ? window.location.origin : "";

export const API_BASE_URL = trimTrailingSlash(
  configuredApiUrl || (import.meta.env.PROD && runtimeOrigin ? runtimeOrigin : DEFAULT_DEV_API_URL)
);

export const apiUrl = (path: string) => {
  if (!path) return API_BASE_URL;
  if (path.startsWith("data:") || ABSOLUTE_URL_PATTERN.test(path)) return path;

  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

export const resolveMediaUrl = (value?: string | null) => {
  if (!value) return "";

  return apiUrl(value);
};
