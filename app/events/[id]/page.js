import React from 'react';
import EventPageClient from './EventPageClient';

export default async function EventPage({ params }) {

  return <EventPageClient id={params} />;
};