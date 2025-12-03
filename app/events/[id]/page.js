import React from 'react';
import EventPageClient from './EventPageClient';

async function fetchIdEvent(id) {
  try {
    const res = await fetch(`${API_URL_BY_ID}${id}`, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify({
        fields: [
          'event_id',
          'id',
          'title',
          'image',
          'url',
          'price',
          'address',
          'from_date',
          'full_text',
          'place_id',
          'main_category_id',
        ],
      }),
    });

    if (!res.ok) {
      throw new Error(`Ошибка поиска id ${res.statusText}`);
    }

    const result = await res.json();

    if (result && Array.isArray(result)) {
      return result[0];
    } else if (result.result && Array.isArray(result.result)) {
      return result.result[0];
    } else if (result.result.events && Array.isArray(result.result.events)) {
      return result.result.events[0];
    } else {
      console.error('Неизвестная структура данных:', result);
    }
  } catch (error) {
    console.log('Ошибка при запросе:', error);
    return null;
  }
}

export default async function EventPage({ params }) {
  const initialEvent = await fetchIdEvent(params.id);

  return <EventPageClient id={params} initialEvent={initialEvent}/>;
}
