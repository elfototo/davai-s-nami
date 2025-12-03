import EventsClient from './EventsClient';
import { API_URL, API_HEADERS } from '../../config';
import dayjs from 'dayjs';

async function getInitialEvents() {
  try {
    const res = await fetch(API_URL, {
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
          'to_date',
          'full_text',
          'place_id',
          'main_category_id',
        ],
        page: 0,
        limit: 20,
      }),
      next: { revalidate: 300 }, // Кеш на 5 минут
    });

    if (!res.ok) {
      throw new Error('Ошибка загрузки');
    }

    const result = await res.json();

    const events = Array.isArray(result)
      ? result
      : Array.isArray(result.result)
      ? result.result
      : Array.isArray(result.events)
      ? result.events
      : Array.isArray(result.result?.events)
      ? result.result.events
      : [];

    return events;
  } catch (error) {
    console.error('Ошибка загрузки событий:', error);
    return [];
  }
}

export async function generateMetadata() {
  return {
    title: 'Все мероприятия в Санкт-Петербурге | События',
    description:
      'Полный список мероприятий, концертов, выставок и событий в Санкт-Петербурге. Найдите интересные события на любой вкус.',
    openGraph: {
      title: 'Все мероприятия в Санкт-Петербурге',
      description: 'Афиша событий и мероприятий',
    },
  };
}

export default async function EventsPage() {
  // Получаем начальные события на сервере
  const initialEvents = await getInitialEvents();

  return <EventsClient initialEvents={initialEvents} />;
}