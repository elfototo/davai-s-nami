'use client';

import useSWR from 'swr';
import { IoMdClose } from 'react-icons/io';
import Card from './Card';
import { API_URL, API_SELECTION_URL, API_HEADERS } from '../config';
import { normalizeEventsList } from '../utils/normalizeEvents';

const EVENT_FIELDS = [
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
  'city_id',
];

// Список событий по id. Город не передаём: id глобальные, запрос по ids
// по городу не фильтруется
const fetchEventsByIds = async (ids) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: API_HEADERS,
    body: JSON.stringify({ ids, fields: EVENT_FIELDS, limit: ids.length }),
  });

  if (!res.ok) {
    throw new Error(`Ошибка загрузки событий подборки: ${res.statusText}`);
  }

  const events = normalizeEventsList(await res.json());
  const order = new Map(ids.map((id, index) => [Number(id), index]));

  // Порядок — как в посте
  return events.sort(
    (a, b) => (order.get(a.id) ?? Infinity) - (order.get(b.id) ?? Infinity),
  );
};

// Подборка из поста: GET api/content-generator/selection/{id}/, город не нужен.
// shown_ids — события из поста
const fetchSelection = async (selectionId) => {
  const res = await fetch(`${API_SELECTION_URL}${selectionId}/`, {
    method: 'GET',
    headers: API_HEADERS,
  });

  if (!res.ok) {
    throw new Error(`Ошибка загрузки подборки: ${res.statusText}`);
  }

  const result = await res.json();
  const selection = result?.result || result;
  const shownIds = selection?.shown_ids || [];

  // Если API отдал события целиком — берём их, иначе догружаем по shown_ids
  let events = normalizeEventsList(selection);
  if (events.length === 0 && shownIds.length > 0) {
    events = await fetchEventsByIds(shownIds);
  }

  return { title: selection?.title || '', events };
};

const Selection = ({ selectionId, onClose }) => {
  const { data, error, isLoading } = useSWR(
    selectionId ? `/api/selection/${selectionId}` : null,
    () => fetchSelection(selectionId),
    { revalidateOnFocus: false },
  );

  if (error) {
    console.error('Ошибка загрузки подборки:', error);
  }

  return (
    <section className="mb-8 rounded-xl bg-[#fff] p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="m-0 font-roboto text-xl font-bold text-[#333]">
          {data?.title || 'Подборка'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть подборку"
          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <span className="mr-1 hidden md:inline">Ко всем мероприятиям</span>
          <IoMdClose size={20} />
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-pink-300 border-r-transparent"></div>
        </div>
      ) : error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          Не удалось загрузить подборку.
        </p>
      ) : data?.events?.length > 0 ? (
        <div className="grid-rows-auto grid grid-cols-2 items-stretch gap-3 md:grid-cols-4">
          {data.events.map((card) => (
            <Card
              type="mini"
              to_date={card.to_date}
              category={card.category}
              main_category_id={card.main_category_id}
              price={card.price}
              title={card.title}
              from_date={card.from_date}
              address={card.address}
              key={card.event_id || card.id}
              id={card.id}
              data={card}
              image={card.image}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">В подборке нет актуальных мероприятий.</p>
      )}
    </section>
  );
};

export default Selection;
