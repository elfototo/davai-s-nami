import EventPlace from './PlaceClient';
import {
  API_URL,
  API_URL_PL,
  SEARCH_URL,
  API_HEADERS,
  API_URL_PL_BY_ID,
} from '../../../config';

async function fetchPlaceById(id) {
  try {
    const res = await fetch(`${API_URL_PL_BY_ID}${id}`, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify({
        fields: [
          'id',
          'place_name',
          'place_address',
          'place_url',
          'place_metro',
          'place_image',
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
    } else if (result.result.places && Array.isArray(result.result.places)) {
      // setPlace(result.result.places[0]);
      return result.result.places[0];
    } else if (result.places && Array.isArray(result.places)) {
      // setPlace(result.places[0]);
      return result.places[0];
    } else {
      console.error('Неизвестная структура данных:', result);
    }
  } catch (error) {
    return null;
  }
}

async function fetchEventsInPlaceByID(id) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify({
        place: [id],
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
      throw new Error(`Ошибка поиска id для events ${res.statusText}`);
    }

    const result = await res.json();

    if (result && Array.isArray(result)) {
      return result;
    } else if (result.result && Array.isArray(result.result)) {
      return result.result;
    } else if (result.result.events && Array.isArray(result.result.events)) {
      return result.result.events;
    } else if (result.events && Array.isArray(result.events)) {
      return result.events;
    } else {
      console.error('Неизвестная структура данных для events:', result);
    }
  } catch (error) {
    return null;
  }
}

export default async function PlacePage({params}) {
  const initialPalce = await fetchPlaceById(params.id);
  const initialPalcesEvents = await fetchEventsInPlaceByID(params.id);

  return <EventPlace initialPalce={initialPalce} initialPalcesEvents={initialPalcesEvents} id={params.id}/>

}
