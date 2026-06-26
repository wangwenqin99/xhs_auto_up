type BaseUrlOptions = {
  appUrl?: string;
  requestOrigin?: string | null;
};

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

export function getBaseUrl(options: BaseUrlOptions = {}): string {
  const explicitUrl = options.appUrl || process.env.APP_URL;
  if (explicitUrl) {
    return trimTrailingSlash(explicitUrl);
  }

  if (options.requestOrigin) {
    return trimTrailingSlash(options.requestOrigin);
  }

  return "http://localhost:3000";
}

export function buildMobileUrl(noteId: string, baseUrl: string): string {
  return `${trimTrailingSlash(baseUrl)}/p/${encodeURIComponent(noteId)}`;
}
