/** A draft always stays private on the built site, even after its scheduled time. */
export function isPublishable(data, now = Date.now()) {
  if (data.draft) return false;
  if (!data.publishAt) return true;
  const time = new Date(data.publishAt).getTime();
  return Number.isFinite(time) && time <= now;
}
