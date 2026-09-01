export type GoogleTagWindow = {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

/** Install the command queue shape expected by Google's official gtag.js loader. */
export function ensureGoogleTagQueue(tagWindow: GoogleTagWindow) {
  tagWindow.dataLayer = tagWindow.dataLayer || [];
  const gtag =
    tagWindow.gtag ||
    function gtag() {
      // Google parses queued gtag commands as Arguments objects.
      // eslint-disable-next-line prefer-rest-params
      tagWindow.dataLayer?.push(arguments);
    };
  tagWindow.gtag = gtag;

  return gtag;
}
