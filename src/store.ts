import { configureStore } from "@reduxjs/toolkit";
import placesReducer from "./api/geocodingApi";
import forecastReducer from "./api/forecastApi";

const store = configureStore({
  reducer: {
    places: placesReducer,
    forecast: forecastReducer,
  },
  middleware: (getDefaultMiddleware) =>
    // The forecast api returns some non-serializable data such as Date
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
export type AppDispatchType = typeof store.dispatch;
export type RootStateType = ReturnType<typeof store.getState>;
