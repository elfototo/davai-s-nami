'use client';

import HeroSearch from '../components/HeroSearsh';
import { useState } from 'react';
import { places } from '../data/events';
import PlaceCard from '../components/PlaceCard';
import { SiMoscowmetro } from "react-icons/si";


export default function Places() {
  const [search, setSearch] = useState('');
  const [dataPlaces, setDataPlaces] = useState(places);


  const filteredPlace = dataPlaces.filter((place) => {

    const sortSearch =
      (search?.toLocaleLowerCase() || '') === '' ? place :
        (place.place_name?.toLocaleLowerCase() || '').includes(search?.toLocaleLowerCase() || '') ||
        (place.place_address?.toLocaleLowerCase() || '').includes(search?.toLocaleLowerCase() || '') ||
        (place.place_metro?.toLocaleLowerCase() || '').includes(search?.toLocaleLowerCase() || '');

    return sortSearch || ''
  })

  return (
    <div>
      <HeroSearch
        search={search}
        setSearch={setSearch}
      />
      <div className='mt-3 max-w-custom-container mx-auto px-4 lg:flex flex-cols justify-center '>
        <div className='w-full grid gap-3 grid-cols-2 md:grid-cols-4 items-stretch'>
          {filteredPlace.map((card) => (
            <PlaceCard
              id={card.id}
              key={card.id}
              place_name={card.place_name}
              place_address={card.place_address}
              place_metro={card.place_metro}
              place_city={card.place_city}
            />
          ))}
        </div>

      </div>
    </div>
  )
}