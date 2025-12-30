import { configureStore } from "@reduxjs/toolkit";
import placesReducer from "./api/geocodingApi"

const store = configureStore({
  reducer: {
    places: placesReducer
  },
});

export default store;
export type AppDispatchType = typeof store.dispatch;
export type RootStateType = ReturnType<typeof store.getState>;
