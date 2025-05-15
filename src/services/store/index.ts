import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { Middleware, configureStore } from '@reduxjs/toolkit';

import ingredientsReducer from '../slices/ingredients';
import feedsReducer from '../slices/feeds';
import userReducer from '../slices/user';
import builderReducer from '../slices/builder';
import ordersReducer from '../slices/orders';

import ordersMiddleware from '../middlewares/orders';

export const store = configureStore({
  reducer: {
    user: userReducer,
    builder: builderReducer,
    ingredients: ingredientsReducer,
    feeds: feedsReducer,
    orders: ordersReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ordersMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch = dispatchHook.withTypes<AppDispatch>();
export const useSelector = selectorHook.withTypes<RootState>();
