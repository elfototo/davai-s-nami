import HeroSearch from '../components/HeroSearsh';
import Filtres from '../components/Filtres';
import Card from '../components/Card';

export default function Events() {
  return (
    <div>
      <HeroSearch />
      <div className='mt-3 max-w-custom-container mx-auto px-4 lg:flex flex-cols justify-center'>
        <aside className='lg:w-[20%] w-full h-auto mb-3 mr-3'>
          <Filtres />
        </aside>
        <section className='lg:w-[80%] w-full'>
          <div className='grid gap-3 grid-cols-2 md:grid-cols-4'>
            <Card type='mini' />
            <Card type='mini' />
            <Card type='mini' />
            <Card type='mini' />
            <Card type='mini' />
            <Card type='mini' />
            <Card type='mini' />
            <Card type='mini' />
            <Card type='mini' />
            <Card type='mini' />
            <Card type='mini' />
            <Card type='mini' />
            <Card type='mini' />
            <Card type='mini' />
            <Card type='mini' />
            <Card type='mini' />
            <Card type='mini' />
            <Card type='mini' />
            <Card type='mini' />
            <Card type='mini' />
          </div>
        </section>
      </div>
    </div>
  );
}
