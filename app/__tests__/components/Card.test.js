import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from '../../../components/Card';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);
dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(timezone);

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt = '', ...props }) => {
    const safeSrc = src && src.length > 0 ? src : '/test.png';
    return <img src={safeSrc} alt={alt} {...props} />;
  },
}));

jest.mock('../../../context/SwrContext.js', () => ({
  useEvents: () => ({
    convertImageUrlToJpeg: jest.fn(() => ({
      title: 'Концерт "Мещера"',
      price: 'Билеты от 1500 ₽',
      address: 'Культурный центр «Сердце», Биржевая линия',
      image:
        'https://images.radario.ru/images/afficheevent/a9366a5e31044bc5895b7925a37f5cd2.jpg',
      from_date: '2024-11-16 16:00:00.000000 +00:00',
      to_date: '2024-11-16 19:00:00.000000 +00:00',
      id: 4826,
      main_category_id: 1,
    })),
  }),
}));

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: () => jest.fn(),
}));

describe('Card', () => {
  const testEvent = {
    title: 'Концерт "Мещера"',
    price: 'Билеты от 1500 ₽',
    address: 'Культурный центр «Сердце», Биржевая линия',
    image:
      'https://images.radario.ru/images/afficheevent/a9366a5e31044bc5895b7925a37f5cd2.jpg',
    from_date: '2024-11-16 16:00:00.000000 +00:00',
    to_date: '2024-11-16 19:00:00.000000 +00:00',
    id: 4826,
    main_category_id: 1,
  };

  test('показывает название события', () => {
    render(<Card {...testEvent} />);

    expect(screen.getByText(/мещера/i)).toBeInTheDocument();
  });

  test('показывает адрес события', () => {
    render(<Card {...testEvent} />);

    expect(screen.getByText(/культурный центр/i)).toBeInTheDocument();
  });

  test('показывает прайс события', () => {
    render(<Card {...testEvent} />);

    expect(screen.getByText(/1500/i)).toBeInTheDocument();
  });

  test('показывает дату события', () => {
    render(<Card {...testEvent} />);

    expect(screen.getByText(/16/i)).toBeInTheDocument();
    expect(screen.getByText(/ноября/i)).toBeInTheDocument();
  });

  test('показывает отформатированную дату события', () => {
    render(<Card {...testEvent} />);

    expect(screen.getByText('Сб, 16 ноября')).toBeInTheDocument();
  });
});
