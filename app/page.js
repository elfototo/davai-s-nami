import './globals.css';

export default function Home() {
  return (
    <div>
      <section className='max-w-custom-container mx-auto'>

      </section>
      <section className='bg-accent-gradient h-[26rem] relative'>
        <div className="flex justify-between h-[inherit] m-0 mx-auto max-w-custom-container overflow-hidden px-4 ">
          <div className='flex items-start justify-center flex-col max-w-[35rem]'>
            <h4 className='font-roboto font-bold text-secondary text-7xl mb-5'>Играй с нами!</h4>
            <p className='font-roboto font-regular text-secondary mb-5'>Нажми на кнопку чтобы найти случайное мероприятие на свой уикенд в Санкт - Петербурге</p>
            <button className='font-roboto font-medium bg-secondary rounded-sm text-title-2 py-1 px-5'>Мне повезет</button>
          </div>
          {/* <img
            src="/img/main-page-banner.png"
            alt="banner"
            className='hidden md:block h-auto object-contain absolute top-10 right-0 transition-transform ease-in-out opacity-0 md:opacity-100'
            /> */}
        </div>
      </section>
      <section className='max-w-custom-container mx-auto px-4'>
        <h1 className='font-roboto font-bold'>Куда сходить</h1>
        <ul className='font-roboto font-medium'>
          <li>Музыка</li>
          <li>Познавательное</li>
          <li>Кино</li>
          <li>Представления</li>
          <li>Выставки</li>
          <li>Тусовки</li>
        </ul>
      </section>
      <section className='max-w-custom-container mx-auto px-4'>
        <h1 className='font-roboto font-bold'>Куда сходить</h1>

      </section>
      <section className='max-w-custom-container mx-auto px-4'>
        <h1 className='font-roboto font-bold'>Куда сходить</h1>

      </section>


    </div>
  );
}
