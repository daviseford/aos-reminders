import { createSlice } from '@reduxjs/toolkit'
import { IReminderStore } from 'types/store'
import { IReminder } from 'types/data'

const initialState: IReminderStore = {}

const setReminders = (state: IReminderStore, action: { payload: IReminder }) => {
  state = action.payload
}

export const reminders = createSlice({
  name: 'reminders',
  initialState,
  reducers: {
    setReminders,
  },
})
