import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
  selectIsInWishlist,
  selectWishlistLoading,
  selectWishlistInitialized,
  selectWishlistItems,
} from "../store/slices/wishlistSlice";

/**
 * Хук для работы с wishlist
 * @param {number} eventId - ID события для проверки
 * @returns {Object} - Объект с методами и состоянием wishlist
 */
export const useWishlist = (eventId = null) => {
  const dispatch = useDispatch();
  
  const isInWishlist = useSelector(eventId ? selectIsInWishlist(eventId) : () => false);
  const loading = useSelector(selectWishlistLoading);
  const initialized = useSelector(selectWishlistInitialized);
  const allItems = useSelector(selectWishlistItems);

  // Автоматически загружаем wishlist при первом использовании
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token && !initialized) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, initialized]);

  const toggleWishlist = async () => {
    if (!eventId) {
      console.warn('eventId is required for toggleWishlist');
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Необходимо авторизоваться');
      return;
    }

    if (isInWishlist) {
      await dispatch(removeFromWishlist(eventId));
    } else {
      await dispatch(addToWishlist(eventId));
    }
  };

  const addEvent = async (id) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Необходимо авторизоваться');
      return;
    }
    await dispatch(addToWishlist(id));
  };

  const removeEvent = async (id) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Необходимо авторизоваться');
      return;
    }
    await dispatch(removeFromWishlist(id));
  };

  const refreshWishlist = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      dispatch(fetchWishlist());
    }
  };

  return {
    isInWishlist,
    loading,
    initialized,
    allItems,
    toggleWishlist,
    addEvent,
    removeEvent,
    refreshWishlist,
  };
};

// Пример использования в компоненте:
// const { isInWishlist, loading, toggleWishlist } = useWishlist(eventId);