import EventsClient from './EventsClient';
import { API_URL, API_HEADERS } from '../../config';
import dayjs from 'dayjs';
import { getServerCity } from '../../utils/cityServer';
import { getCity } from '../../utils/cities';

async function getInitialEvents(city) {
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
        limit: 100,
        city,
      }),
      next: { revalidate: 300 }, // Кеш на 5 минут
    });

    if (!res.ok) {
      throw new Error('Ошибка загрузки');
    }

    const result = await res.json();

    console.log("result", result);

    const events = Array.isArray(result)
      ? result
      : Array.isArray(result.result)
        ? result.result
        : Array.isArray(result.events)
          ? result.events
          : Array.isArray(result.result?.events)
            ? result.result.events
            : [];

    console.log('events', events);

    return events;
  } catch (error) {
    console.error('Ошибка загрузки событий:', error);
    return [];
  }
}

export async function generateMetadata() {
  const { nameIn } = getCity(getServerCity());

  return {
    title: `Все мероприятия в ${nameIn} | События`,
    description: `Полный список мероприятий, концертов, выставок и событий в ${nameIn}. Найдите интересные события на любой вкус.`,
    openGraph: {
      title: `Все мероприятия в ${nameIn}`,
      description: 'Афиша событий и мероприятий',
    },
  };
}

export default async function EventsPage() {
  // Получаем начальные события на сервере
  const city = getServerCity();
  const initialEvents = await getInitialEvents(city);

  return <EventsClient initialEvents={initialEvents} serverCity={city} />;
}
