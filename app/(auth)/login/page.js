// 'use client';

// import { useState } from 'react';
// import { NEXT_PUBLIC_Login } from '../../../config';
// import { useRouter } from 'next/navigation';

// export default function LoginPage() {
//   const [user, setUser] = useState({
//     nickname: '',
//     password: '',
//   });

//   const [errors, setErrors] = useState({});
//   const router = useRouter();

//   const requireFields = ['nickname', 'password'];

//   const validate = (name, value) => {
//     switch (name) {
//       case 'nickname': {
//         if (!value.trim()) return 'Поле не должно быть пустым';
//         if (value.trim().length < 2) return 'Не менее двух символов';
//         return null;
//       }

//       case 'password': {
//         if (!value.trim()) return 'Поле не должно быть пустым';
//         if (value.trim().length < 8) return 'Не менее двух символов';
//         return null;
//       }
//     }
//   };

//   const handleOnSubmit = async (e) => {
//     e.preventDefault();

//     const errorList = {};

//     requireFields.forEach((key) => {
//       const newErr = validate(key, user[key]);

//       if (newErr) {
//         errorList[key] = newErr;
//       }
//     });

//     setErrors(errorList);

//     if (Object.keys(errorList).length === 0) {
//       try {
//         const response = await fetch(NEXT_PUBLIC_Login, {
//           method: 'POST',
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//             Accept: 'application/json',
//           },
//           body: JSON.stringify(user),
//         });

//         if (!response.ok) {
//           throw new Error('network error');
//         }

//         const data = await response.json();
//         console.log('result', data);

//         if (data.access_token) {
//           localStorage.setItem('access_token', data.access_token);
//           console.log('access_token сохранён в localStorage');
//         } else {
//           throw new Error('access_token не получен');
//         }

//         const expiresAt = Date.now() + 30 * 60 * 1000;
//         localStorage.setItem('tokenExpiresAt', expiresAt.toString());
//         console.log(
//           'Время истечения:',
//           new Date(expiresAt).toLocaleString(),
//         );

//         console.log('refresh_token в httpOnly cookie (не доступен для JS)');

//         window.dispatchEvent(new Event('auth-changed'));

//         router.push('/dashboard');

//         // alert('Форма отправлена');
//         setUser({
//           nickname: '',
//           password: '',
//         });
//       } catch (err) {
//         console.log('ошибка', err);
//       }
//     }
//   };

//   const handleOnChange = (e) => {
//     const { name, value } = e.target;

//     setUser((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
//   };

//   const isValidating =
//     Object.keys(errors).some((err) => err) &&
//     requireFields.every((name) => user[name].trim() !== '');

//   return (
//     <main className="flex items-center justify-center">
//       <form
//         onSubmit={handleOnSubmit}
//         className="grid gap-5 rounded-xl bg-gray-100 p-10"
//       >
//         <div className="grid grid-cols-[1fr_3fr] gap-5">
//           <label htmlFor="nickname">Nickname</label>
//           <div>
//             <input
//               onChange={handleOnChange}
//               value={user.nickname}
//               type="text"
//               placeholder="nickname"
//               name="nickname"
//               className="w-full rounded-lg px-2 py-1"
//             />
//             {errors.nickname && (
//               <div className="text-red-400">{errors.nickname}</div>
//             )}
//           </div>
//         </div>

//         <div className="grid grid-cols-[1fr_3fr] gap-5">
//           <label htmlFor="password">Пароль</label>
//           <div>
//             <input
//               onChange={handleOnChange}
//               value={user.password}
//               type="password"
//               placeholder="password"
//               name="password"
//               className="w-full rounded-lg px-2 py-1"
//             />
//             {errors.password && (
//               <div className="text-red-400">{errors.password}</div>
//             )}
//           </div>
//         </div>

//         <button
//           disabled={!isValidating}
//           className={`${isValidating ? 'cursor-pointer rounded-lg bg-[#D52FDD] text-white' : 'cursor-not-allowed bg-gray-300'} col-span-full w-full rounded-lg px-3 py-2`}
//         >
//           Отправить
//         </button>
//       </form>
//     </main>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { NEXT_PUBLIC_Login, API_URL1 } from '../../../config';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [user, setUser] = useState({
    nickname: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isTelegramAvailable, setIsTelegramAvailable] = useState(false);
  const [telegramLoading, setTelegramLoading] = useState(false);
  const router = useRouter();

  const requireFields = ['nickname', 'password'];

  // useEffect(() => {
  //   const tryRestoreSession = async () => {
  //     try {
  //       const res = await fetch(`${API_URL1}api/auth/refresh`, {
  //         method: 'POST',
  //         credentials: 'include',
  //       });

  //       if (!res.ok) return;

  //       const data = await res.json();

  //       if (data.access_token) {
  //         localStorage.setItem('access_token', data.access_token);
  //         const expiresAt = Date.now() + 30 * 60 * 1000;
  //         localStorage.setItem('tokenExpiresAt', expiresAt.toString());

  //         console.log('♻️ Session restored on login page');
  //         router.replace('/dashboard');
  //       }
  //     } catch {
  //       // ничего — пользователь реально не залогинен
  //     }
  //   };

  //   tryRestoreSession();
  // }, []);

  // Проверяем доступность Telegram при загрузке
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initData) {
      setIsTelegramAvailable(true);
      console.log('✅ Telegram доступен для входа');
    }
  }, []);

  const validate = (name, value) => {
    switch (name) {
      case 'nickname': {
        if (!value.trim()) return 'Поле не должно быть пустым';
        if (value.trim().length < 2) return 'Не менее двух символов';
        return null;
      }
      case 'password': {
        if (!value.trim()) return 'Поле не должно быть пустым';
        if (value.trim().length < 8) return 'Не менее 8 символов';
        return null;
      }
    }
  };

  // Обычный вход (логин/пароль)
  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const errorList = {};
    requireFields.forEach((key) => {
      const newErr = validate(key, user[key]);
      if (newErr) {
        errorList[key] = newErr;
      }
    });

    setErrors(errorList);

    if (Object.keys(errorList).length === 0) {
      try {
        const response = await fetch(NEXT_PUBLIC_Login, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(user),
        });

        if (!response.ok) {
          throw new Error('network error');
        }

        const data = await response.json();
        console.log('result', data);

        console.log('All cookies:', document.cookie);

        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token);
          console.log('✅ access_token сохранён в localStorage');
        } else {
          throw new Error('access_token не получен');
        }

        const expiresAt = Date.now() + 30 * 60 * 1000;
        localStorage.setItem('tokenExpiresAt', expiresAt.toString());

        // Очищаем флаг выхода
        sessionStorage.removeItem('user_logged_out');

        window.dispatchEvent(new Event('auth-changed'));
        console.log('All cookies:', document.cookie);
        router.push('/dashboard');

        setUser({
          nickname: '',
          password: '',
        });
      } catch (err) {
        console.log('ошибка', err);
        setErrors({ submit: 'Ошибка входа. Проверьте данные.' });
      }
    }
  };

  // Вход через Telegram
  const handleTelegramLogin = async () => {
    if (!window.Telegram?.WebApp?.initData) {
      alert('Telegram данные недоступны');
      return;
    }

    setTelegramLoading(true);

    try {
      const response = await fetch(`${API_URL1}api/auth/telegram/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          init_data: window.Telegram.WebApp.initData,
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка Telegram авторизации');
      }

      const data = await response.json();

      localStorage.setItem('access_token', data.access_token);
      const expiresAt = Date.now() + 30 * 60 * 1000;
      localStorage.setItem('tokenExpiresAt', expiresAt.toString());

      // Очищаем флаг выхода
      sessionStorage.removeItem('user_logged_out');

      console.log('✅ Telegram авторизация успешна');
      window.dispatchEvent(new Event('auth-changed'));
      router.push('/dashboard');
    } catch (err) {
      console.error('❌ Ошибка Telegram авторизации:', err);
      setErrors({ submit: 'Не удалось войти через Telegram' });
    } finally {
      setTelegramLoading(false);
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const isValidating =
    Object.keys(errors).some((err) => errors[err]) === false &&
    requireFields.every((name) => user[name].trim() !== '');

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md">
        {/* Кнопка Telegram (если доступна) */}
        {isTelegramAvailable && (
          <div className="mb-6">
            <button
              onClick={handleTelegramLogin}
              disabled={telegramLoading}
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#0088cc] px-4 py-3 text-white transition-colors hover:bg-[#006699] disabled:opacity-50"
            >
              <span className="text-2xl">✈️</span>
              {telegramLoading ? 'Авторизация...' : 'Войти через Telegram'}
            </button>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-300"></div>
              <span className="text-gray-500">или</span>
              <div className="h-px flex-1 bg-gray-300"></div>
            </div>
          </div>
        )}

        {/* Обычная форма входа */}
        <form
          onSubmit={handleOnSubmit}
          className="grid gap-5 rounded-xl bg-gray-100 p-10"
        >
          <h2 className="mb-4 text-center text-2xl font-bold">Вход</h2>

          <div className="grid grid-cols-[1fr_3fr] gap-5">
            <label htmlFor="nickname">Nickname</label>
            <div>
              <input
                onChange={handleOnChange}
                value={user.nickname}
                type="text"
                placeholder="nickname"
                name="nickname"
                className="w-full rounded-lg px-2 py-1"
              />
              {errors.nickname && (
                <div className="mt-1 text-sm text-red-400">
                  {errors.nickname}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-[1fr_3fr] gap-5">
            <label htmlFor="password">Пароль</label>
            <div>
              <input
                onChange={handleOnChange}
                value={user.password}
                type="password"
                placeholder="password"
                name="password"
                className="w-full rounded-lg px-2 py-1"
              />
              {errors.password && (
                <div className="mt-1 text-sm text-red-400">
                  {errors.password}
                </div>
              )}
            </div>
          </div>

          {errors.submit && (
            <div className="text-center text-red-400">{errors.submit}</div>
          )}

          <button
            disabled={!isValidating}
            className={`${
              isValidating
                ? 'cursor-pointer bg-[#D52FDD] hover:bg-[#B826BB]'
                : 'cursor-not-allowed bg-gray-300'
            } col-span-full w-full rounded-lg px-3 py-2 text-white transition-colors`}
          >
            Войти
          </button>
        </form>
      </div>
    </main>
  );
}
