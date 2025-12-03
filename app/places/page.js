import Places from './PlacesClient';
import { API_URL, API_URL_PL, SEARCH_URL, API_HEADERS } from '../../config';

async function fetcherPlaces(url) {
  const urlObj = new URL(url, API_URL_PL);
  const pageIndex = parseInt(urlObj.searchParams.get('page'), 20) || 0;

  let places = [];

  try {
    const res = await fetch(API_URL_PL, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify({
        fields: [
          'id',
          'place_name',
          'place_address',
          'place_metro',
          'place_image',
        ],
        page: pageIndex,
        limit: 20,
        order_by: 'id-asc',
      }),
    });

    if (!res.ok) {
      throw new Error('Ошибка получения task_id: ', res.statusText);
    }

    const result = await res.json();

    let newEvents = [];

    if (Array.isArray(result)) {
      newEvents = result;
    } else if (result.result && Array.isArray(result.result)) {
      newEvents = result.result;
    } else if (result.result.places && Array.isArray(result.result.places)) {
      newEvents = result.result.places;
    } else {
      console.log('Неизвестная структура данных');
    }

    return newEvents || [];
  } catch (error) {
    console.log('Ошибка создания задачи', error);
  }

  return places;
}

export default async function PlacesPage() {
  const limit = 20;
  const initialPlaces = await fetcherPlaces();

  return <Places initialPlaces={initialPlaces}/>;
}
