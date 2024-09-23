export default function Events() {
    return (
      <div>
        <section style={{ background: 'pink', padding: '20px' }}>
          <input type="search" placeholder="Поиск событий..." style={{ width: '100%' }} />
          <div>
            <span>Категории: Музыка, Кино, Театр...</span>
          </div>
        </section>
        <div style={{ display: 'flex' }}>
          <aside style={{ width: '20%' }}>
            <h3>Фильтры</h3>
            <div>Когда: Сегодня, Завтра...</div>
            <div>Теги...</div>
          </aside>
          <section style={{ width: '80%' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {/* Шаблон событий */}
              <div style={{ width: '30%', backgroundColor: "#f4f4f9", height: "50px" }}>Событие 1</div>
              <div style={{ width: '30%', backgroundColor: "#f4f4f9", height: "50px" }}>Событие 2</div>
              <div style={{ width: '30%', backgroundColor: "#f4f4f9", height: "50px" }}>Событие 3</div>
              {/* ... */}
            </div>
          </section>
        </div>
      </div>
    );
  }
  