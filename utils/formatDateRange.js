import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);
dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDateRange = (from_date, to_date) => {
  if (!from_date) return 'Скоро будет дата';

  const from = dayjs(from_date).utc().tz('Europe/Moscow');
  const to = to_date ? dayjs(to_date).utc().tz('Europe/Moscow') : null;

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const fromWeekday = capitalize(from.format('dd'));
  const toWeekday = to ? capitalize(to.format('dd')) : '';

  if (!to || from.isSame(to)) {
    return `${fromWeekday}, ${from.format('D MMMM')}`;
  }

  if (from.isSame(to, 'day')) {
    return `${fromWeekday}, ${from.format('D MMMM')}`;
  }

  if (to.hour() === 0 && to.minute() === 0) {
    return `${fromWeekday}, ${from.format('D MMMM')} - 00:00`;
  }

  return `${fromWeekday}, ${from.format('D MMMM')} - ${toWeekday}, ${to.format('D MMMM')}`;
};
