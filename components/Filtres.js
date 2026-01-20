'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import CalendarModal from './Calendar';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { categoriesID } from '../app/data/events';
import { IoClose } from 'react-icons/io5';
import { IoIosCloseCircle } from 'react-icons/io';
import { filterActions } from './filtersReducer';

const Filtres = ({ filters, dispatch }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isInitialMount = useRef(true);

  const {
    selectedTags,
    startDate,
    endDate,
    selectedButton,
    selectedDateLabel,
    isOpen,
  } = filters;

  const categoryTags = {
    Культура: ['Культура', 'Театр', 'Перформанс'],
    Кино: ['Кино'],
    Лекции: ['Лекция'],
    Вечеринки: ['Фестиваль', 'Вечеринка'],
    Музыка: ['Концерт', 'Фестиваль'],
    Представления: ['Концерт', 'Театр', 'Перформанс', 'Стендап'],
  };

  // Функция для обновления URL на основе текущих фильтров
  const updateURL = (tags, dateButton, start, end, dateLabel) => {
    const params = new URLSearchParams();

    // Добавляем теги
    // if (tags && tags.length > 0) {
    //   params.set('tags', tags.join(','));
    // }
    if (tags && tags.length > 0) {
      params.set('tags', encodeURIComponent(tags.join(',')));
    }

    // Добавляем дату-кнопку (сегодня/завтра/выходные)
    if (dateButton && dateButton !== 'date') {
      params.set('date', dateButton);
    }

    // Добавляем кастомный диапазон дат
    if (start && end && dateButton === 'date') {
      params.set('startDate', start.format('YYYY-MM-DD'));
      params.set('endDate', end.format('YYYY-MM-DD'));
      if (dateLabel) {
        params.set('dateLabel', dateLabel);
      }
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(newUrl, { scroll: false });
  };

  // Инициализация фильтров из URL при первой загрузке
  useEffect(() => {
    if (!isInitialMount.current) return;

    const categoryParam = searchParams.get('category');
    const tagsParam = searchParams.get('tags');
    const dateParam = searchParams.get('date');
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const dateLabelParam = searchParams.get('dateLabel');

    // Собираем параметры для инициализации
    const initParams = {};

    // Приоритет: tags из URL -> category -> ничего
    if (tagsParam) {
      // initParams.tags = tagsParam.split(',').filter((tag) => tag.trim());
      const decodedTags = decodeURIComponent(tagsParam);
      initParams.tags = decodedTags.split(',').filter((tag) => tag.trim());
    } else if (categoryParam && categoryTags[categoryParam]) {
      initParams.tags = categoryTags[categoryParam];
    }

    // Обрабатываем даты
    if (dateParam) {
      initParams.date = dateParam;
    } else if (categoryParam === 'Сегодня') {
      initParams.date = 'today';
    } else if (categoryParam === 'Завтра') {
      initParams.date = 'tomorrow';
    } else if (categoryParam === 'Выходные') {
      initParams.date = 'weekend';
    }

    // Кастомный диапазон дат
    if (startDateParam && endDateParam) {
      initParams.startDate = startDateParam;
      initParams.endDate = endDateParam;
      initParams.dateLabel = dateLabelParam;
    }

    // Инициализируем только если есть параметры
    if (Object.keys(initParams).length > 0) {
      dispatch(filterActions.initFromUrl(initParams));

      // Если был старый формат с category, обновляем URL на новый формат
      if (categoryParam) {
        setTimeout(() => {
          updateURL(
            initParams.tags || [],
            initParams.date || '',
            startDateParam ? { format: () => startDateParam } : null,
            endDateParam ? { format: () => endDateParam } : null,
            dateLabelParam,
          );
        }, 100);
      }
    }

    isInitialMount.current = false;
  }, []);

  // Синхронизация URL при изменении фильтров (кроме первого рендера)
  useEffect(() => {
    if (isInitialMount.current) return;

    const hasFilters =
      selectedTags.length > 0 || selectedButton || startDate || endDate;

    if (hasFilters) {
      updateURL(
        selectedTags,
        selectedButton,
        startDate,
        endDate,
        selectedDateLabel,
      );
    } else {
      // Очищаем URL если все фильтры сброшены
      router.replace(pathname, { scroll: false });
    }
  }, [selectedTags, selectedButton, startDate, endDate, selectedDateLabel]);

  const handleDateRangeChange = (start, end) => {
    if (start && end) {
      dispatch(filterActions.setDateRange(start, end));
    }
  };

  const buttons = [
    {
      id: 'today',
      label: 'Сегодня',
      onClick: () => dispatch(filterActions.selectToday()),
    },
    {
      id: 'tomorrow',
      label: 'Завтра',
      onClick: () => dispatch(filterActions.selectTomorrow()),
    },
    {
      id: 'weekend',
      label: 'Выходные',
      onClick: () => dispatch(filterActions.selectWeekend()),
    },
  ];

  if (startDate && endDate && selectedDateLabel) {
    buttons.push({
      id: 'date',
      label: selectedDateLabel,
      onClick: () => dispatch(filterActions.clearDates()),
    });
  }

  const allButtons = [
    ...categoriesID.map((category) => ({
      id: category.id,
      label: category.category,
      icon: category.icon,
      color: category.color,
      onClick: () => dispatch(filterActions.toggleTag(category.category)),
    })),
    ...buttons,
  ];

  const sortedButtons = [...allButtons].sort((a, b) => {
    const aActive = selectedButton === a.id || selectedTags.includes(a.label);
    const bActive = selectedButton === b.id || selectedTags.includes(b.label);
    return bActive - aActive;
  });

  const hasActiveFilters =
    selectedButton.length > 0 ||
    selectedTags.length > 0 ||
    endDate ||
    startDate;

  return (
    <div
      className={`${isOpen ? 'bg-white' : 'bg-[#f4f4f9]'} relative rounded-lg lg:border lg:border-[#D9D9D9] lg:bg-white lg:shadow-lg`}
    >
      <div className={`${isOpen ? 'absolute' : 'block'}`}>
        <div className="scroll-hidden -mx-2 flex justify-start overflow-y-auto whitespace-nowrap px-2 py-2 lg:hidden">
          <button
            onClick={() => dispatch(filterActions.toggleFilterPanel())}
            className={`mr-3 flex items-center justify-center rounded-md bg-[#fff] px-2 py-1 text-[1rem] ${
              hasActiveFilters ? 'bg-pink-400 text-white' : 'bg-[#fff]'
            } ${!isOpen ? 'block' : 'hidden'}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5"
            >
              <path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
            </svg>
          </button>

          {sortedButtons.map((button) => (
            <button
              key={button.id}
              onClick={button.onClick}
              className={`mx-3 flex items-center justify-center rounded-md px-2 py-1 text-[1rem] ${
                selectedButton === button.id ||
                selectedTags.includes(button.label) ||
                button.id === 'date'
                  ? 'bg-pink-400 text-white'
                  : 'bg-[#fff]'
              } ${!isOpen ? 'block' : 'hidden'}`}
            >
              {button.label}
              {(selectedButton === button.id ||
                selectedTags.includes(button.label) ||
                button.id === 'date') && (
                <IoClose size={18} className="ml-2 mt-[3px]" />
              )}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <button
            onClick={() => dispatch(filterActions.clearAllFilters())}
            className={`mr-3 flex items-center justify-center rounded-md py-1 text-[1rem] font-medium text-red-500 lg:hidden ${!isOpen ? 'block' : 'hidden'}`}
          >
            <IoIosCloseCircle size={16} className="mr-1 mt-[2px]" />
            Сбросить фильтры
          </button>
        )}
      </div>

      <div
        className={`${isOpen ? 'block' : 'hidden'} relative w-full p-4 lg:block`}
      >
        <div>
          <div className="mb-5">
            <div className="mb-3 flex items-baseline justify-between">
              <h3 className="text-lg">Когда</h3>
              <Link href="/events">
                <div
                  className="text-blue-600 underline"
                  onClick={() => {
                    dispatch(filterActions.clearAllFilters());
                    dispatch(filterActions.toggleFilterPanel());
                  }}
                >
                  Отмена
                </div>
              </Link>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => dispatch(filterActions.selectToday())}
                className={`${selectedButton === 'today' ? 'transform bg-pink-400 text-white transition-colors duration-200' : 'bg-gray-100 hover:bg-gray-200'} w-1/2 rounded-md py-2`}
              >
                Сегодня
              </button>
              <button
                onClick={() => dispatch(filterActions.selectTomorrow())}
                className={`${selectedButton === 'tomorrow' ? 'transform bg-pink-400 text-white transition-colors duration-200' : 'bg-gray-100 hover:bg-gray-200'} w-1/2 rounded-md py-2`}
              >
                Завтра
              </button>
            </div>

            <div className="mt-2 flex items-center justify-center">
              <button
                onClick={() => dispatch(filterActions.selectWeekend())}
                className={`${selectedButton === 'weekend' ? 'transform bg-pink-400 text-white transition-colors duration-200' : 'bg-gray-100 hover:bg-gray-200'} w-1/2 rounded-md px-4 py-2 lg:w-full`}
              >
                Выходные
              </button>
            </div>

            <div className="mt-2 flex w-full items-start justify-center lg:flex-col">
              <CalendarModal
                startDate={startDate}
                endDate={endDate}
                onDateRangeChange={handleDateRangeChange}
              />
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-lg">Категории</h3>
            <div className="flex flex-wrap">
              {categoriesID.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() =>
                    dispatch(filterActions.toggleTag(tag.category))
                  }
                  className={`mx-1 my-1 rounded-full px-4 py-1 text-left ${selectedTags.includes(tag.category) ? 'bg-pink-400 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {tag.category}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button
              onClick={() => dispatch(filterActions.toggleFilterPanel())}
              className="mt-5 w-full transform rounded-lg bg-pink-500 py-4 font-roboto text-[1rem] font-medium text-[#fff] shadow-lg transition-transform duration-300 hover:bg-pink-400 lg:hidden"
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filtres;
