// 'use client';

// import { useState, useEffect } from 'react';
// import { FaUserCircle } from 'react-icons/fa';
// import { FaEdit } from 'react-icons/fa';
// import { IoIosSave } from 'react-icons/io';
// import { API_URL1 } from '../../config';
// import { IoCloseOutline } from 'react-icons/io5';
// import Card from '../../components/Card';
// import { useDispatch, useSelector } from 'react-redux';
// import { API_HEADERS, API_URL_BY_ID } from '../../config';

// import {
//   fetchWishlist,
//   addToWishlist,
//   removeFromWishlist,
//   selectIsInWishlist,
//   selectWishlistLoading,
//   selectWishlistInitialized,
// } from '../../store/slices/wishlistSlice.js';

// const fetchIdEvent = async (id) => {
//   try {
//     const res = await fetch(`${API_URL_BY_ID}${id}`, {
//       method: 'POST',
//       headers: API_HEADERS,
//       body: JSON.stringify({
//         fields: [
//           'event_id',
//           'id',
//           'title',
//           'image',
//           'url',
//           'price',
//           'address',
//           'from_date',
//           'to_date',
//           'full_text',
//           'place_id',
//           'main_category_id',
//         ],
//       }),
//     });

//     if (!res.ok) {
//       throw new Error(`Ошибка поиска id ${res.statusText}`);
//     }

//     const result = await res.json();

//     if (result && Array.isArray(result)) {
//       return result[0];
//     } else if (result.result && Array.isArray(result.result)) {
//       return result.result[0];
//     } else if (result.result.events && Array.isArray(result.result.events)) {
//       return result.result.events[0];
//     } else {
//       console.error('Неизвестная структура данных:', result);
//     }
//   } catch (error) {
//     console.log('Ошибка при запросе:', error);
//     return null;
//   }
// };

// export default function DashBoard() {
//   const [isEdit, setIsedit] = useState(false);
//   const [user, setUser] = useState({});
//   const [userInput, setUserInput] = useState({
//     full_name: '',
//     telegram_nickname: '',
//   });
//   const [errors, setErrors] = useState({});
//     const [loadingEvents, setLoadingEvents] = useState(false);

//   const [wishlistEvents, setWishlistEvents] = useState([]);

//   const wishlistLoading = useSelector(selectWishlistLoading);
//   const wishlistInitialized = useSelector(selectWishlistInitialized);
//   const dispatch = useDispatch();

//   const token = localStorage.getItem('access_token');

//   const wishlistItems = useSelector((state) => state.wishlist.items);

//   console.log('wishlistItems', wishlistItems);

//   useEffect(() => {
//     if (token && !wishlistInitialized) {
//       dispatch(fetchWishlist());
//     }
//   }, [dispatch, wishlistInitialized, token]);

//   useEffect(() => {
//     if (!wishlistItems || wishlistItems.length === 0) {
//       setWishlistEvents([]);
//       setLoadingEvents(false);
//       return;
//     }

//     let cancelled = false;
//     setLoadingEvents(true);

//     const loadEvents = async () => {
//       try {
//         console.log('🔍 Loading events for IDs:', wishlistItems);

//         const eventPromises = wishlistItems.map(async (id) => {
//           const event = await fetchIdEvent(id);
//           if (!event) {
//             console.warn(`⚠️ Failed to load event ${id}`);
//           }
//           return event;
//         });

//         const events = await Promise.all(eventPromises);

//         // ✅ Фильтруем null значения
//         const validEvents = events.filter((event) => event !== null);

//         if (!cancelled) {
//           console.log('✅ Loaded events:', validEvents);
//           setWishlistEvents(validEvents);
//           setLoadingEvents(false);
//         }
//       } catch (err) {
//         console.error('❌ Failed to load wishlist events:', err);
//         if (!cancelled) {
//           setLoadingEvents(false);
//         }
//       }
//     };

//     loadEvents();

//     return () => {
//       cancelled = true;
//     };
//   }, [wishlistItems]);

//   const fetchUser = async (url, token) => {
//     try {
//       const res = await fetch(`${url}api/auth/me`, {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//           'Access-Control-Allow-Origin': '*',
//         },
//       });

//       console.log('res', res);

//       if (!res.ok) {
//         throw new Error('network Error');
//       }

//       const data = await res.json();

//       console.log('data', data);
//       setUser(data);
//     } catch (err) {
//       console.log('err', err);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchUser(API_URL1, token);
//     }
//   }, []);

//   const validate = (name, value) => {
//     switch (name) {
//       case 'full_name':
//         if (!value.trim()) return 'поле не должно быть пустым';
//         return null;

//       case 'telegram_nickname':
//         if (!value.trim()) return 'поле не должно быть пустым';
//         return null;
//     }
//   };

//   const handleOnChange = async (e) => {
//     const { name, value } = e.target;

//     setUserInput((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
//   };

//   const handleSubmit = async () => {
//     const newErrorList = {};

//     const fieldsToValidate = ['full_name', 'telegram_nickname'];

//     fieldsToValidate.forEach((key) => {
//       const value = userInput[key] || user[key];

//       const newErr = validate(key, value);
//       if (newErr) {
//         newErrorList[key] = newErr;
//       }
//     });
//     setErrors(newErrorList);

//     if (Object.keys(newErrorList).length === 0) {
//       try {
//         const res = await fetch(`${API_URL1}api/auth/me`, {
//           method: 'PUT',
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             full_name: userInput.full_name || user.full_name,
//             telegram_nickname:
//               userInput.telegram_nickname || user.telegram_nickname,
//           }),
//         });

//         if (!res.ok) {
//           throw new Error('network error');
//         }

//         const data = await res.json();

//         console.log('data forms', data);

//         setUser({
//           nickname: user.nickname,
//           email: user.email,
//           full_name: userInput.full_name || user.full_name,
//           telegram_nickname:
//             userInput.telegram_nickname || user.telegram_nickname,
//         });

//         setUserInput({
//           full_name: '',
//           telegram_nickname: '',
//         });
//         setIsedit(false);
//       } catch (err) {
//         console.log('err', err);
//       }
//     }
//   };

//   const handleEdit = () => {
//     setUserInput({
//       full_name: user.full_name || '',
//       telegram_nickname: user.telegram_nickname || '',
//     });
//     setIsedit(true);
//   };
//   const handleCancel = () => {
//     setUserInput({
//       full_name: '',
//       telegram_nickname: '',
//     });
//     setErrors({});
//     setIsedit(false);
//   };

//   return (
//     <div className="mx-auto min-h-screen max-w-custom-container bg-gray-100 py-8">
//       <div className="mx-auto mb-16 w-full px-5">
//         <h1 className="mb-10 mt-0 text-start font-roboto font-bold text-gray-700">
//           Личный кабинет
//         </h1>

//         {/* <h1 className="my-10 mt-10 text-start text-gray-700 font-roboto font-bold">
//           Информация об аккаунте
//         </h1> */}

//         <div className="rounded-lg border border-gray-300 bg-white p-10 shadow-sm">
//           <div className="flex flex-col items-center gap-10 md:flex-row">
//             <div className="flex-shrink-0">
//               <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200">
//                 <FaUserCircle size={32} className="text-gray-500" />
//               </div>
//             </div>

//             <div className="flex-1">
//               {isEdit ? (
//                 <div className="space-y-5">
//                   <div className="space-y-2">
//                     <label
//                       htmlFor="nickname"
//                       className="block font-medium text-gray-700"
//                     >
//                       Полное имя:
//                     </label>
//                     <input
//                       type="text"
//                       id="full_name"
//                       name="full_name"
//                       placeholder="Введите full_name"
//                       value={userInput.full_name}
//                       onChange={handleOnChange}
//                       className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     {errors.full_name && (
//                       <span className="text-sm text-red-500">
//                         {errors.full_name}
//                       </span>
//                     )}
//                   </div>

//                   <div className="flex gap-3 pt-3">
//                     <button
//                       onClick={handleSubmit}
//                       className="flex items-center justify-center gap-2 rounded-lg bg-pink-400 px-4 py-2 text-white transition-colors hover:bg-pink-300"
//                     >
//                       <IoIosSave size={18} />
//                       <span>Сохранить</span>
//                     </button>

//                     <button
//                       onClick={handleCancel}
//                       className="flex items-center justify-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
//                     >
//                       <IoCloseOutline size={18} />
//                       <span>Отмена</span>
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="grid items-start justify-between md:flex md:flex-row">
//                   <div className="mb-10 md:mb-0">
//                     <h2 className="mb-2 text-xl font-semibold text-gray-800">
//                       {user.nickname}
//                     </h2>
//                     <div className="grid gap-2">
//                       <div className="grid sm:grid-cols-[1fr_2fr] sm:gap-5">
//                         <p>email:</p>
//                         <p className="text-gray-600">{user.email}</p>
//                       </div>
//                       <div className="grid sm:grid-cols-[1fr_2fr] sm:gap-5">
//                         <p>Полное имя: </p>
//                         <p className="text-gray-600">{user.full_name}</p>
//                       </div>
//                     </div>
//                   </div>

//                   <button
//                     onClick={handleEdit}
//                     className="flex items-center justify-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
//                   >
//                     <FaEdit size={16} />
//                     <span>Редактировать</span>
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <h1 className="my-10 mt-10 text-start font-roboto font-bold text-gray-700">
//           Избранное
//         </h1>

//         {/* {(wishlistLoading || loadingEvents) && (
//           <div className="flex justify-center py-10">
//             <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-400 border-t-transparent"></div>
//           </div>
//         )} */}

//         {!wishlistLoading && !loadingEvents && (
//           <div className="grid-rows-auto mt-10 grid grid-cols-2 items-stretch gap-3 md:grid-cols-4">
//             {wishlistEvents.length > 0 ? (
//               wishlistEvents.map((card) => (
//                 <Card
//                   type="mini"
//                   to_date={card.to_date}
//                   category={card.category}
//                   main_category_id={card.main_category_id}
//                   price={card.price}
//                   title={card.title}
//                   from_date={card.from_date}
//                   address={card.address}
//                   key={card.event_id}
//                   id={card.id}
//                   data={card}
//                   image={card.image}
//                 />
//               ))
//             ) : (
//               <div className="col-span-full py-10 text-center text-lg text-gray-500">
//                 {wishlistItems.length === 0
//                   ? 'Ваш список избранного пуст'
//                   : 'Не удалось загрузить события'}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
'use client';

import { useState, useEffect, useMemo } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import { IoIosSave } from 'react-icons/io';
import { API_URL1 } from '../../config';
import { IoCloseOutline } from 'react-icons/io5';
import Card from '../../components/Card';
import { useDispatch, useSelector } from 'react-redux';
import { API_HEADERS, API_URL_BY_ID } from '../../config';

import {
  fetchWishlist,
  selectWishlistItems,
  selectWishlistLoading,
  selectWishlistInitialized,
} from '../../store/slices/wishlistSlice.js';

const fetchIdEvent = async (id) => {
  try {
    const res = await fetch(`${API_URL_BY_ID}${id}`, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify({
        fields: [
          'event_id',
          'id',
          'title',
          'image',
          'url',
          'price',
          'address',
          'from_date',
          'to_date',
          'full_text',
          'place_id',
          'main_category_id',
        ],
      }),
    });

    if (!res.ok) {
      throw new Error(`Ошибка поиска id ${res.statusText}`);
    }

    const result = await res.json();

    if (result && Array.isArray(result)) {
      return result[0];
    } else if (result.result && Array.isArray(result.result)) {
      return result.result[0];
    } else if (result.result.events && Array.isArray(result.result.events)) {
      return result.result.events[0];
    } else {
      console.error('Неизвестная структура данных:', result);
      return null;
    }
  } catch (error) {
    console.error('Ошибка при запросе:', error);
    return null;
  }
};

export default function DashBoard() {
  const [isEdit, setIsedit] = useState(false);
  const [user, setUser] = useState({});
  const [userInput, setUserInput] = useState({
    full_name: '',
    telegram_nickname: '',
  });
  const [errors, setErrors] = useState({});
  const [loadingEvents, setLoadingEvents] = useState(false);
  
  // ✅ Храним Map для быстрого доступа к событиям по ID
  const [eventsCache, setEventsCache] = useState(new Map());

  const wishlistLoading = useSelector(selectWishlistLoading);
  const wishlistInitialized = useSelector(selectWishlistInitialized);
  const wishlistItems = useSelector(selectWishlistItems);
  const dispatch = useDispatch();

  const token = localStorage.getItem('access_token');

  // ✅ Фильтруем события из кэша на основе текущего wishlistItems
  const wishlistEvents = useMemo(() => {
    return wishlistItems
      .map(id => eventsCache.get(id))
      .filter(event => event !== undefined);
  }, [wishlistItems, eventsCache]);

  console.log('📋 wishlistItems:', wishlistItems);
  console.log('🗂️ eventsCache size:', eventsCache.size);
  console.log('📺 wishlistEvents:', wishlistEvents);

  // ✅ Загружаем wishlist при монтировании
  useEffect(() => {
    if (token && !wishlistInitialized) {
      console.log('🔄 Fetching initial wishlist...');
      dispatch(fetchWishlist());
    }
  }, [dispatch, wishlistInitialized, token]);

  // ✅ Загружаем только НОВЫЕ события, которых нет в кэше
  useEffect(() => {
    if (!wishlistItems || wishlistItems.length === 0) {
      console.log('📭 Wishlist is empty');
      setLoadingEvents(false);
      return;
    }

    // Определяем какие события нужно загрузить
    const missingIds = wishlistItems.filter(id => !eventsCache.has(id));

    if (missingIds.length === 0) {
      console.log('✅ All events already in cache');
      setLoadingEvents(false);
      return;
    }

    let cancelled = false;
    setLoadingEvents(true);

    const loadMissingEvents = async () => {
      try {
        console.log('🔍 Loading missing events:', missingIds);
        
        const eventPromises = missingIds.map(async (id) => {
          const event = await fetchIdEvent(id);
          if (!event) {
            console.warn(`⚠️ Failed to load event ${id}`);
          }
          return { id, event };
        });

        const results = await Promise.all(eventPromises);

        if (!cancelled) {
          // ✅ Обновляем кэш только с новыми событиями
          setEventsCache(prev => {
            const newCache = new Map(prev);
            results.forEach(({ id, event }) => {
              if (event) {
                newCache.set(id, event);
              }
            });
            console.log('✅ Cache updated, new size:', newCache.size);
            return newCache;
          });
          setLoadingEvents(false);
        }
      } catch (err) {
        console.error('❌ Failed to load events:', err);
        if (!cancelled) {
          setLoadingEvents(false);
        }
      }
    };

    loadMissingEvents();

    return () => {
      cancelled = true;
    };
  }, [wishlistItems, eventsCache]);

  const fetchUser = async (url, token) => {
    try {
      const res = await fetch(`${url}api/auth/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

      if (!res.ok) {
        throw new Error('network Error');
      }

      const data = await res.json();
      console.log('👤 User data:', data);
      setUser(data);
    } catch (err) {
      console.error('❌ Error fetching user:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser(API_URL1, token);
    }
  }, [token]);

  const validate = (name, value) => {
    switch (name) {
      case 'full_name':
        if (!value.trim()) return 'поле не должно быть пустым';
        return null;

      case 'telegram_nickname':
        if (!value.trim()) return 'поле не должно быть пустым';
        return null;

      default:
        return null;
    }
  };

  const handleOnChange = async (e) => {
    const { name, value } = e.target;
    setUserInput((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSubmit = async () => {
    const newErrorList = {};
    const fieldsToValidate = ['full_name', 'telegram_nickname'];

    fieldsToValidate.forEach((key) => {
      const value = userInput[key] || user[key];
      const newErr = validate(key, value);
      if (newErr) {
        newErrorList[key] = newErr;
      }
    });
    
    setErrors(newErrorList);

    if (Object.keys(newErrorList).length === 0) {
      try {
        const res = await fetch(`${API_URL1}api/auth/me`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            full_name: userInput.full_name || user.full_name,
            telegram_nickname:
              userInput.telegram_nickname || user.telegram_nickname,
          }),
        });

        if (!res.ok) {
          throw new Error('network error');
        }

        const data = await res.json();
        console.log('✅ Updated user data:', data);

        setUser({
          nickname: user.nickname,
          email: user.email,
          full_name: userInput.full_name || user.full_name,
          telegram_nickname:
            userInput.telegram_nickname || user.telegram_nickname,
        });

        setUserInput({
          full_name: '',
          telegram_nickname: '',
        });
        setIsedit(false);
      } catch (err) {
        console.error('❌ Error updating user:', err);
      }
    }
  };

  const handleEdit = () => {
    setUserInput({
      full_name: user.full_name || '',
      telegram_nickname: user.telegram_nickname || '',
    });
    setIsedit(true);
  };

  const handleCancel = () => {
    setUserInput({
      full_name: '',
      telegram_nickname: '',
    });
    setErrors({});
    setIsedit(false);
  };

  return (
    <div className="mx-auto min-h-screen max-w-custom-container bg-gray-100 py-8">
      <div className="mx-auto mb-16 w-full px-5">
        <h1 className="mb-10 mt-0 text-start font-roboto font-bold text-gray-700">
          Личный кабинет
        </h1>

        <div className="rounded-lg border border-gray-300 bg-white p-10 shadow-sm">
          <div className="flex flex-col items-center gap-10 md:flex-row">
            <div className="flex-shrink-0">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200">
                <FaUserCircle size={32} className="text-gray-500" />
              </div>
            </div>

            <div className="flex-1">
              {isEdit ? (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label
                      htmlFor="full_name"
                      className="block font-medium text-gray-700"
                    >
                      Полное имя:
                    </label>
                    <input
                      type="text"
                      id="full_name"
                      name="full_name"
                      placeholder="Введите полное имя"
                      value={userInput.full_name}
                      onChange={handleOnChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.full_name && (
                      <span className="text-sm text-red-500">
                        {errors.full_name}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      onClick={handleSubmit}
                      className="flex items-center justify-center gap-2 rounded-lg bg-pink-400 px-4 py-2 text-white transition-colors hover:bg-pink-300"
                    >
                      <IoIosSave size={18} />
                      <span>Сохранить</span>
                    </button>

                    <button
                      onClick={handleCancel}
                      className="flex items-center justify-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
                    >
                      <IoCloseOutline size={18} />
                      <span>Отмена</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid items-start justify-between md:flex md:flex-row">
                  <div className="mb-10 md:mb-0">
                    <h2 className="mb-2 text-xl font-semibold text-gray-800">
                      {user.nickname}
                    </h2>
                    <div className="grid gap-2">
                      <div className="grid sm:grid-cols-[1fr_2fr] sm:gap-5">
                        <p>Email:</p>
                        <p className="text-gray-600">{user.email}</p>
                      </div>
                      <div className="grid sm:grid-cols-[1fr_2fr] sm:gap-5">
                        <p>Полное имя:</p>
                        <p className="text-gray-600">{user.full_name || '—'}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleEdit}
                    className="flex items-center justify-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
                  >
                    <FaEdit size={16} />
                    <span>Редактировать</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <h1 className="my-10 mt-10 text-start font-roboto font-bold text-gray-700">
          Избранное
        </h1>

        {/* ✅ Показываем индикатор только при первой загрузке */}
        {wishlistLoading && wishlistEvents.length === 0 && (
          <div className="flex justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-400 border-t-transparent"></div>
          </div>
        )}

        {/* ✅ Сетка карточек - НЕ перезагружается при удалении */}
        <div className="grid-rows-auto mt-10 grid grid-cols-2 items-stretch gap-3 md:grid-cols-4">
          {wishlistEvents.length > 0 ? (
            wishlistEvents.map((card) => (
              <Card
                type="mini"
                to_date={card.to_date}
                category={card.category}
                main_category_id={card.main_category_id}
                price={card.price}
                title={card.title}
                from_date={card.from_date}
                address={card.address}
                key={card.id}
                id={card.id}
                data={card}
                image={card.image}
              />
            ))
          ) : !wishlistLoading ? (
            <div className="col-span-full py-10 text-center text-lg text-gray-500">
              {wishlistItems.length === 0
                ? 'Ваш список избранного пуст'
                : ''}
            </div>
          ) : null}
        </div>

        {/* ✅ Маленький индикатор загрузки новых событий */} 
        {loadingEvents && wishlistEvents.length > 0 && (
          <div className="mt-4 flex justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-pink-400 border-t-transparent"></div>
          </div>
        )}
      </div>
    </div>
  );
}