import './globals.css';
import Card from './components/Card';
import Categories from './components/Categories';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <section className='max-w-custom-container mx-auto'>

      </section>
      <section className='bg-accent-gradient h-[26rem] relative overflow-hidden'>
        <div className="flex justify-between h-[inherit] m-0 mx-auto max-w-custom-container overflow-hidden pl-4">
          <div className='flex items-start justify-center flex-col max-w-[35rem] md:max-w-[26rem] lg:max-w-[35rem] md:mr-5'>
            <h4 className='font-roboto font-bold text-secondary text-7xl mb-5'>Играй с нами!</h4>
            <p className='font-roboto font-regular text-secondary mb-5'>Нажми на кнопку чтобы найти случайное мероприятие на свой уикенд в Санкт - Петербурге</p>
            <button className='px-6 py-2 font-medium tracking-wide text-[#333] capitalize transition-colors duration-300 transform bg-white rounded-lg hover:outline-none hover:ring hover:ring-pink-100 hover:ring-opacity-1/2">'>Мне повезет</button>
          </div>
          <div className='h-full w-1/2 overflow-hidden relative hidden md:block'>
            <div className="absolute top-10 left-0 w-full h-full bg-cover bg-no-repeat"
              style={{ backgroundImage: `url('/img/banner.svg')`, backgroundPosition: 'left center' }}>
            </div>
          </div>
        </div>

      </section>
      <section className='max-w-custom-container mx-auto px-4'>
        <h1 className='font-roboto font-bold'>Куда сходить</h1>
        <ul className='font-roboto font-medium'>
          <Categories />

        </ul>
      </section>
      <section className='max-w-custom-container mx-auto px-4'>
        <div className='flex justify-between items-baseline'>
          <h1 className='font-roboto font-bold'>Горячие новинки месяца</h1>
          <Link href="/events" className='text-[#777] whitespace-nowrap ml-5 underline'>
            <p className="text-[#777]">Смотреть весь список</p>
          </Link>
        </div>
        <div className='flex justify-center flex-wrap'>
          <div className='grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
            <Card />
            <Card />
            <Card />
            <Card />
          </div>
        </div>
      </section>
      <section className='max-w-custom-container mx-auto px-4'>
        <div className='flex justify-between items-baseline'>
          <h1 className='font-roboto font-bold'>Куда сходить сегодня и завтра</h1>
          <Link href="/events" className='text-[#777] whitespace-nowrap ml-5 underline'>
            <p className="text-[#777]">Смотреть весь список</p>
          </Link>
        </div>
        <div className='flex justify-center flex-wrap'>
          <div className='grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
            <Card />
            <Card />
            <Card />
            <Card />
          </div>
        </div>
      </section>
      <section className='max-w-custom-container mx-auto px-4'>
        <div className='flex justify-between items-baseline'>
          <h1 className='font-roboto font-bold'>Куда сходить в выходные</h1>
          <Link href="/events" className='text-[#777] whitespace-nowrap ml-5 underline'>
            <p className="text-[#777]">Смотреть весь список</p>
          </Link>
        </div>
        <div className='flex justify-center flex-wrap'>
          <div className='grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
            <Card />
            <Card />
            <Card />
            <Card />
          </div>
        </div>
      </section>


    </div>
  );
}
