// Ответы API по событиям приходят в разных обёртках — достаём массив
export const normalizeEventsList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.events)) return payload.events;
  if (Array.isArray(payload?.result?.events)) return payload.result.events;
  if (Array.isArray(payload?.result)) return payload.result;
  return [];
};
