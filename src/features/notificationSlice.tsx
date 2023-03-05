/**
 * Created by jason on 2022/9/22.
 */
import {INotificationItem} from "../utils/types";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

export type RequestState = 'pending' | 'fulfilled' | 'rejected'

export const  fetchNotification = createAsyncThunk<INotificationItem[], string>(
  'notification',
  async () => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/`)
    const data = await response.json()
    if (response.status < 200 || response.status >= 300) {
      return data
    }
    return data
  }
)


const  initialNotifications: INotificationItem[] = []

export const   notificationSlice = createSlice({
  name: 'notification',
  initialState: initialNotifications,
  reducers: {
  },
  extraReducers: builder => {
    // builder.addCase()
  }
})


export  default  notificationSlice.actions
