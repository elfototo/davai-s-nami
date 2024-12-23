import dayjs from 'dayjs';
import 'dayjs/locale/ru'; // Импорт локали

dayjs.locale('ru'); // Устанавливаем локаль глобально

// Импортируем плагины, если нужно
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export default dayjs;