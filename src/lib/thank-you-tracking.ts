export const THANK_YOU_EVENT_ID_KEY = "kraft_form_event_id";
const THANK_YOU_TRACKED_PREFIX = "kraft_thank_you_tracked:";

export const getThankYouTrackedKey = (eventId: string) =>
  `${THANK_YOU_TRACKED_PREFIX}${eventId}`;

/**
 * Sends one pending thank-you event and marks that exact event ID only after
 * the analytics queue accepted it. A failed/not-ready attempt remains pending.
 */
export function trackPendingThankYouEvent(
  storage: Pick<Storage, "getItem" | "setItem" | "removeItem">,
  send: (eventId: string) => boolean,
): boolean {
  const eventId = storage.getItem(THANK_YOU_EVENT_ID_KEY);
  if (!eventId) return false;

  const trackedKey = getThankYouTrackedKey(eventId);
  if (storage.getItem(trackedKey) === "true") {
    storage.removeItem(THANK_YOU_EVENT_ID_KEY);
    return true;
  }

  if (!send(eventId)) return false;

  storage.setItem(trackedKey, "true");
  storage.removeItem(THANK_YOU_EVENT_ID_KEY);
  return true;
}
