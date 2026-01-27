import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL1 } from '../../config';

// Async thunks
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No token found');
      }

      const res = await fetch(`${API_URL1}api/users/me/events`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch wishlist');
      }

      const data = await res.json();
      console.log('data', data);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const addToWishlist = createAsyncThunk(
  'wishlist/add',
  async (eventId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No token found');
      }

      const normalizedId =
        typeof eventId === 'number' ? eventId : parseInt(eventId, 10);

      const res = await fetch(
        `${API_URL1}api/users/me/events/${normalizedId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!res.ok) {
        throw new Error('Failed to add to wishlist');
      }

      const data = await res.json();
      console.log('data addList', normalizedId, data);

      return { eventId, data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/remove',
  async (eventId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No token found');
      }

      const normalizedId =
        typeof eventId === 'number' ? eventId : parseInt(eventId, 10);

      const res = await fetch(
        `${API_URL1}api/users/me/events/${normalizedId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!res.ok) {
        throw new Error('Failed to remove from wishlist');
      }

      const data = await res.json();
      console.log('data delete', normalizedId, data);

      return eventId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [], // Массив ID событий в wishlist
    loading: false,
    error: null,
    initialized: false, // Флаг, что данные загружены хотя бы раз
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.initialized = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        // Предполагаем, что API возвращает массив объектов с id
        state.items = action.payload.map((event) => {
          const id =
            typeof event.id === 'number' ? event.id : parseInt(event.id, 10);
          return id;
        });
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.initialized = true;
        console.error('❌ Failed to fetch wishlist:', action.payload);
      })
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const eventId = action.payload.eventId;
        if (!state.items.includes(eventId)) {
          state.items.push(eventId);
          console.log(
            '✅ Added to state:',
            eventId,
            'Current items:',
            state.items,
          );
        } else {
          console.log('⚠️ Already in wishlist:', eventId);
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('❌ Failed to add:', action.payload);
      })
      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const eventId = action.payload;

        console.log('🗑️ Removing ID:', eventId, 'Type:', typeof eventId);
        console.log('📋 Before removal:', state.items);

        // ✅ Фильтруем с помощью строгого сравнения
        state.items = state.items.filter((id) => {
          const match = id !== eventId;
          if (!match) {
            console.log('🎯 Found match, removing:', id);
          }
          return match;
        });

        console.log('📋 After removal:', state.items);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('❌ Failed to remove:', action.payload);
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistLoading = (state) => state.wishlist.loading;
export const selectWishlistError = (state) => state.wishlist.error;
export const selectIsInWishlist = (eventId) => (state) => {
  const normalizedId =
    typeof eventId === 'number' ? eventId : parseInt(eventId, 10);
  const result = state.wishlist.items.includes(normalizedId);

  // Для отладки (можно удалить потом)
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `🔍 Check wishlist for ID ${normalizedId}:`,
      result,
      'Items:',
      state.wishlist.items,
    );
  }

  return result;
};
export const selectWishlistInitialized = (state) => state.wishlist.initialized;

export default wishlistSlice.reducer;
