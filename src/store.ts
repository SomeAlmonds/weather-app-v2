import { configureStore } from "@reduxjs/toolkit";
import placesReducer from "./api/geocodingApi";
import forecastReducer from "./api/forecastApi";


const store = configureStore({
  reducer: {
    places: placesReducer,
    forecast: forecastReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: true,
      },
    }),
});

export default store;
export type AppDispatchType = typeof store.dispatch;
export type RootStateType = ReturnType<typeof store.getState>;
