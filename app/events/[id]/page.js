import React from 'react';
import EventPageClient from './EventPageClient';

export default async function EventPage({ params }) {
  console.log('та самая страница')
  console.log('параметры', params, 'id', params.id)

  return <EventPageClient id={params} />;
};