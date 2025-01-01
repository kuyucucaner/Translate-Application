import { configureStore } from '@reduxjs/toolkit';
import translationReducer from '../redux/translation-slice';

const store = configureStore({
  reducer: {
    translation: translationReducer,
  },
});

export default store;
