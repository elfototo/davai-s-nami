import HomePage from './home';
import { API_URL, API_HEADERS } from '../config';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isoWeek from 'dayjs/plugin/isoWeek';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isoWeek);
dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

async function fetchEvents(dateRange) {
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
      
      next: { 
        revalidate: 300 
      }
    });

    if (!res.ok) {
      throw new Error(`Ошибка: ${res.statusText}`);
    }

    const result = await res.json();

    let events = [];

    if (result.result && Array.isArray(result.result)) {
      events = result.result;
    } else if (result.result.events && Array.isArray(result.result.events)) {
      events = result.result.events;
    }

    return events;
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    return [];
  }
}

export default async function Home() {
  const todayforcount = dayjs().utc().tz('Europe/Moscow').startOf('day');

  const today = todayforcount.format('YYYY-MM-DD');
  const tomorrow = todayforcount
    .add(1, 'day')
    .startOf('day')
    .format('YYYY-MM-DD');
  const month = todayforcount
    .add(1, 'month')
    .startOf('day')
    .format('YYYY-MM-DD');

  const startOfWeekendforCount = dayjs()
    .isoWeekday(6)
    .utc()
    .tz('Europe/Moscow')
    .startOf('day');
  const startOfWeekend = startOfWeekendforCount.format('YYYY-MM-DD');
  const endOfWeekend = startOfWeekendforCount
    .add(1, 'day')
    .format('YYYY-MM-DD');

  const dateRange1 = { 
    date_from: today, 
    date_to: tomorrow, 
    limit: 10 
  };
  const dateRangemonth = { 
    date_from: today, 
    date_to: month, 
    limit: 10 
  };
  const dateRange2 = {
    date_from: startOfWeekend,
    date_to: endOfWeekend,
    limit: 10,
  };
  const dateRangeForGame = { 
    date_from: today, 
    date_to: month, 
    limit: 20 
  };

  const [
    dataEventDateRange1,
    dataEventDateRange2,
    dataEventDateRangeMonth
  ] = await Promise.all([
    fetchEvents(dateRange1),
    fetchEvents(dateRange2),
    fetchEvents(dateRangemonth)
  ]);

  return (
    <HomePage
      initialDataDateRange1={dataEventDateRange1}
      initialDataDateRange2={dataEventDateRange2}
      initialDataDateRangeMonth={dataEventDateRangeMonth}
      
      dateRangeForGame={dateRangeForGame}
      dateRange2={dateRange2}
      dateRange1={dateRange1}
      dateRangemonth={dateRangemonth}
    />
  );
}

export async function generateMetadata() {
  return {
    title: 'События - Главная страница',
    description: 'Актуальные события на сегодня, выходные и месяц',
  };
}
