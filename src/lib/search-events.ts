export const OPEN_SEARCH_EVENT = "wae:open-search";

export function openGlobalSearch() {
  window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));
}
