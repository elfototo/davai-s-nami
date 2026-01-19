import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isoWeek);

export const initialFiltersState = {
  search: '',
  startDate: null,
  endDate: null,
  selectedTags: [],
  selectedTagsId: [],
  selectedButton: '',
  selectedDateLabel: '',
  sortPrice: null,
  category: '',
  isOpen: false,
};

// Action types
export const FILTER_ACTIONS = {
  SET_SEARCH: 'SET_SEARCH',
  TOGGLE_TAG: 'TOGGLE_TAG',
  SET_TAGS: 'SET_TAGS',
  SELECT_TODAY: 'SELECT_TODAY',
  SELECT_TOMORROW: 'SELECT_TOMORROW',
  SELECT_WEEKEND: 'SELECT_WEEKEND',
  SET_DATE_RANGE: 'SET_DATE_RANGE',
  CLEAR_DATES: 'CLEAR_DATES',
  SET_CATEGORY: 'SET_CATEGORY',
  SET_SORT_PRICE: 'SET_SORT_PRICE',
  TOGGLE_FILTER_PANEL: 'TOGGLE_FILTER_PANEL',
  CLEAR_ALL_FILTERS: 'CLEAR_ALL_FILTERS',
  APPLY_CATEGORY_TAGS: 'APPLY_CATEGORY_TAGS',
  SET_SELECTED_TAGS_ID: 'SET_SELECTED_TAGS_ID',
};

export function filtersReducer(state, action) {
  switch (action.type) {
    case FILTER_ACTIONS.SET_SEARCH:
      return {
        ...state,
        search: action.payload,
      };

    case FILTER_ACTIONS.TOGGLE_TAG: {
      const tag = action.payload;
      const isSelected = state.selectedTags.includes(tag);

      return {
        ...state,
        selectedTags: isSelected
          ? state.selectedTags.filter((t) => t !== tag)
          : [...state.selectedTags, tag],
      };
    }

    case FILTER_ACTIONS.SET_TAGS:
      return {
        ...state,
        selectedTags: action.payload,
      };

    case FILTER_ACTIONS.SELECT_TODAY: {
      if (state.selectedButton === 'today') {
        return {
          ...state,
          startDate: null,
          endDate: null,
          selectedButton: '',
          selectedDateLabel: '',
        };
      }

      const today = dayjs().tz('Europe/Moscow').startOf('day');

      return {
        ...state,
        startDate: today,
        endDate: today,
        selectedButton: 'today',
        selectedDateLabel: '',
      };
    }

    case FILTER_ACTIONS.SELECT_TOMORROW: {
      if (state.selectedButton === 'tomorrow') {
        return {
          ...state,
          startDate: null,
          endDate: null,
          selectedButton: '',
          selectedDateLabel: '',
        };
      }

      const tomorrow = dayjs().tz('Europe/Moscow').add(1, 'day').startOf('day');

      return {
        ...state,
        startDate: tomorrow,
        endDate: tomorrow,
        selectedButton: 'tomorrow',
        selectedDateLabel: '',
      };
    }

    case FILTER_ACTIONS.SELECT_WEEKEND: {
      if (state.selectedButton === 'weekend') {
        return {
          ...state,
          startDate: null,
          endDate: null,
          selectedButton: '',
          selectedDateLabel: '',
        };
      }

      const today = dayjs().tz('Europe/Moscow');
      const currentDayOfWeek = today.isoWeekday(); // 1 = Пн, 7 = Вс
      
      let startOfWeekend;
      
      // Если сегодня уже суббота или воскресенье - берём текущие выходные
      if (currentDayOfWeek === 6 || currentDayOfWeek === 7) {
        startOfWeekend = today.isoWeekday(6).startOf('day');
      } else {
        // Иначе берём следующую субботу
        startOfWeekend = today.isoWeekday(6).startOf('day');
      }
      
      const endOfWeekend = startOfWeekend.add(1, 'day');

      return {
        ...state,
        startDate: startOfWeekend,
        endDate: endOfWeekend,
        selectedButton: 'weekend',
        selectedDateLabel: '',
      };
    }

    case FILTER_ACTIONS.SET_DATE_RANGE: {
      const { startDate, endDate } = action.payload;

      const rangeStartDate = dayjs(startDate).format('DD MMM');
      const rangeEndDate = dayjs(endDate).format('DD MMM');

      const dateLabel =
        rangeStartDate === rangeEndDate
          ? rangeStartDate
          : `${rangeStartDate} - ${rangeEndDate}`;

      return {
        ...state,
        startDate: dayjs(startDate).tz('Europe/Moscow').startOf('day'),
        endDate: dayjs(endDate).tz('Europe/Moscow').startOf('day'),
        selectedButton: 'date',
        selectedDateLabel: dateLabel,
      };
    }

    case FILTER_ACTIONS.CLEAR_DATES:
      return {
        ...state,
        startDate: null,
        endDate: null,
        selectedButton: '',
        selectedDateLabel: '',
      };

    case FILTER_ACTIONS.SET_CATEGORY:
      return {
        ...state,
        category: action.payload,
      };

    case FILTER_ACTIONS.SET_SORT_PRICE:
      return {
        ...state,
        sortPrice: action.payload,
      };

    case FILTER_ACTIONS.TOGGLE_FILTER_PANEL:
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    case FILTER_ACTIONS.CLEAR_ALL_FILTERS:
      return {
        ...initialFiltersState,
        isOpen: state.isOpen,
      };

    case FILTER_ACTIONS.APPLY_CATEGORY_TAGS:
      return {
        ...state,
        selectedTags: action.payload,
      };

    case FILTER_ACTIONS.SET_SELECTED_TAGS_ID:
      return {
        ...state,
        selectedTagsId: action.payload,
      };

    default:
      return state;
  }
}

// Action creators
export const filterActions = {
  setSearch: (value) => ({
    type: FILTER_ACTIONS.SET_SEARCH,
    payload: value,
  }),

  toggleTag: (tag) => ({
    type: FILTER_ACTIONS.TOGGLE_TAG,
    payload: tag,
  }),

  setTags: (tags) => ({
    type: FILTER_ACTIONS.SET_TAGS,
    payload: tags,
  }),

  selectToday: () => ({
    type: FILTER_ACTIONS.SELECT_TODAY,
  }),

  selectTomorrow: () => ({
    type: FILTER_ACTIONS.SELECT_TOMORROW,
  }),

  selectWeekend: () => ({
    type: FILTER_ACTIONS.SELECT_WEEKEND,
  }),

  setDateRange: (startDate, endDate) => ({
    type: FILTER_ACTIONS.SET_DATE_RANGE,
    payload: { startDate, endDate },
  }),

  clearDates: () => ({
    type: FILTER_ACTIONS.CLEAR_DATES,
  }),

  setCategory: (category) => ({
    type: FILTER_ACTIONS.SET_CATEGORY,
    payload: category,
  }),

  setSortPrice: (value) => ({
    type: FILTER_ACTIONS.SET_SORT_PRICE,
    payload: value,
  }),

  toggleFilterPanel: () => ({
    type: FILTER_ACTIONS.TOGGLE_FILTER_PANEL,
  }),

  clearAllFilters: () => ({
    type: FILTER_ACTIONS.CLEAR_ALL_FILTERS,
  }),

  applyCategoryTags: (tags) => ({
    type: FILTER_ACTIONS.APPLY_CATEGORY_TAGS,
    payload: tags,
  }),

  setSelectedTagsId: (ids) => ({
    type: FILTER_ACTIONS.SET_SELECTED_TAGS_ID,
    payload: ids,
  }),
};