import { configureStore } from '@reduxjs/toolkit';
import wishlistReducer from './slices/wishlistSlice';

export const store = configureStore({
  reducer: {
    wishlist: wishlistReducer,
    // Здесь можно добавить другие редьюсеры
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Если нужно для работы с датами и т.д.
    }),
});

export default store;