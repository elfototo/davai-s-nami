import { API_URL, API_URL_PL, SEARCH_URL, API_HEADERS } from '../../config';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isoWeek from 'dayjs/plugin/isoWeek';
import isBetween from 'dayjs/plugin/isBetween';
import About from "./AboutClient";

dayjs.extend(isoWeek);
dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

async function fetcher(dateRange) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify({
        date_from: dateRange.date_from,
        date_to: dateRange.date_to,
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
        limit: dateRange.limit,
      }),
    });

    if (!res.ok) {
      throw new Error(`Ошибка: ${res.statusText}`);
    }

    const result = await res.json();

    let eventsfromFetcher = [];

    if (result.result && Array.isArray(result.result)) {
      eventsfromFetcher = result.result;
    } else if (result.result.events && Array.isArray(result.result.events)) {
      eventsfromFetcher = result.result.events;
    } else {
      return;
    }

    return eventsfromFetcher;
  } catch (error) {
    console.log('Ошибка при выполнении задачи', error);
  }
}

export default async function AboutPage() {
  const todayforcount = dayjs().utc().tz('Europe/Moscow').startOf('day');
  const today = dayjs()
    .utc()
    .tz('Europe/Moscow')
    .startOf('day')
    .format('YYYY-MM-DD');
  const month = todayforcount
    .add(1, 'month')
    .startOf('day')
    .format('YYYY-MM-DD');

  const dateRangemonth = { date_from: today, date_to: month, limit: 10 };

  const initialEvents = await fetcher(dateRangemonth)

  return <About initialEvents={initialEvents}/>
}
