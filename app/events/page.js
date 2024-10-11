import HeroSearch from '../components/HeroSearsh';
import Filtres from '../components/Filtres';
import Card from '../components/Card';

export default function Events() {
  const events = [
    {
      id: 1,
      category: 'Кинопоказ',
      price: '250',
      title: 'Название мероприятия',
      date: '11/10/2024',
      place: 'Эрмитаж',
    },
    {
      id: 2,
      category: 'Музыка',
      price: '1800',
      title: 'Название мероприятия',
      date: '12/10/2024',
      place: 'Эрмитаж',
    },
    {
      id: 3,
      category: 'Стендап',
      price: '1500',
      title: 'Название мероприятия',
      date: '13/10/2024',
      place: 'Эрмитаж',
    },
    {
      id: 4,
      category: 'Оркестр',
      price: '900',
      title: 'Название мероприятия',
      date: '13/10/2024',
      place: 'Эрмитаж',
    },
    {
      id: 5,
      category: 'Лекция',
      price: '1500',
      title: 'Название мероприятия',
      date: '11/10/2024',
      place: 'Эрмитаж',
    },
    {
      id: 6,
      category: 'Тусовка',
      price: '700',
      title: 'Название мероприятия',
      date: '10/10/2024',
      place: 'Эрмитаж',
    },
    {
      id: 7,
      category: 'Музыка',
      price: '1800',
      title: 'Название мероприятия',
      date: '12/10/2024',
      place: 'Эрмитаж',
    },
    {
      id: 8,
      category: 'Стендап',
      price: '690',
      title: 'Название мероприятия',
      date: '13/10/2024',
      place: 'Эрмитаж',
    },
    {
      id: 9,
      category: 'Театр',
      price: '1500',
      title: 'Название мероприятия',
      date: '11/10/2024',
      place: 'Эрмитаж',
    },
    {
      id: 10,
      category: 'Выставка',
      price: '550',
      title: 'Название мероприятия',
      date: '13/10/2024',
      place: 'Эрмитаж',
    },
    {
      id: 11,
      category: 'Кинопоказ',
      price: '200',
      title: 'Название мероприятия',
      date: '15/10/2024',
      place: 'Эрмитаж',
    }
  ];
  
  return (
    <div>
      <HeroSearch />
      <div className='mt-3 max-w-custom-container mx-auto px-4 lg:flex flex-cols justify-center'>
        <aside className='lg:w-[20%] w-full h-auto mb-3 mr-3'>
          <Filtres />
        </aside>
        <section className='lg:w-[80%] w-full'>
          <div className='grid gap-3 grid-cols-2 md:grid-cols-4'>
            {events.map((event) => (
              <Card
                type='mini'
                category={event.category}
                price={event.price}
                title={event.title}
                date={event.date}
                place={event.place}
                id={event.id} 
                />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
