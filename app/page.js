import './globals.css';

export default function Home() {
  return (
    <div>
      <section style={{
        height: '420px',
        background: 'linear-gradient(90deg, rgba(78,19,179,1) 30%, rgba(245,45,133,1) 76%)',
      }}>
        <div
          className="container banner"
          style={{
            position: "relative",
            display: "flex",
            color: "#fff",
            overflow: "hidden",
            height: "inherit",
            width: "1140px",
            margin: "0 auto",
          }}>
          <div>
            <h1 style={{
              fontSize: "81px",
              margin: "0",
            }}>Играй с нами!</h1>
            <p style={{
              fontSize: "20px",
              maxWidth: "531px",
              marginBottom: "20px"
            }}>Нажми на кнопку чтобы найти случайное мероприятие на свой уикенд в Санкт - Петербурге</p>
            <button 
            style={{
              padding: "5px 20px",
              color: "#333",
              backgroundColor: "#fff",
            }}
            >Мне повезет</button>
          </div>
          <img
            src="/main-page-banner.png"
            alt="banner"
            style={{
              width: "580px",
              position: "absolute",
              top: "75px",
              right: "30px",
            }}
          />
        </div>
      </section>
      <section>
        <h2>Куда сходить</h2>
        <ul>
          <li>Музыка</li>
          <li>Познавательное</li>
          <li>Кино</li>
          <li>Представления</li>
          <li>Выставки</li>
          <li>Тусовки</li>
        </ul>
      </section>
    </div>
  );
}
