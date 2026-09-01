const CITY_PAGE_DIRECT_CALL_SOURCE =
  /^city_page_[a-z0-9-]+_(?:hero|final)$/;

export const isCityPageDirectCallSource = (source: string) =>
  CITY_PAGE_DIRECT_CALL_SOURCE.test(source);

export const getDirectCallInteractionLocation = (source: string) =>
  isCityPageDirectCallSource(source) ? source : "floating_call_modal";

export const getDirectCallSheetMessage = (source: string) =>
  isCityPageDirectCallSource(source)
    ? `Klick auf "Jetzt anrufen" auf der Stadtseite (${source}).`
    : `Klick auf "Jetzt direkt anrufen" im Anruf-Dialog (${source}).`;
