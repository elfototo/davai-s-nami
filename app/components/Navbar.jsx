import Link from 'next/link';

const Navbar = () => {
  return (
    <nav>
      <Link href="/">Главная</Link>
      <Link href="/about">О нас</Link>
    </nav>
  );
};

export default Navbar;
