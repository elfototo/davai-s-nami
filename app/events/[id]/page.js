export default function EventPage({ params }) {
    const { id } = params;
  
    return (
      <div>
        <h1>Событие {id}</h1>
        <p>Подробная информация о событии.</p>
      </div>
    );
  }