import request from 'superagent'
import { ISavedArmy } from 'types/savedArmy'

const endpoint = `https://bgj1fpqcj6.execute-api.us-east-1.amazonaws.com/dev`

interface ICreateItems {
  userName: string
  [key: string]: any
}

interface ICreateSavedArmy extends ISavedArmy {
  userName: string
}

const createItem = (data: ICreateItems) => request.post(`${endpoint}/items`).send(data)
const createSavedArmy = (data: ICreateSavedArmy) => request.post(`${endpoint}/items`).send(data)
const deleteItem = (id: string, userName: string) => request.delete(`${endpoint}/items/${id}/${userName}`)
const getItem = (id: string) => request.get(`${endpoint}/items/${id}`)
const getUserItems = (userName: string) => request.get(`${endpoint}/user/${userName}`)
const updateItem = (id: string) => request.put(`${endpoint}/items/${id}`)

export const Api = {
  createItem,
  createSavedArmy,
  deleteItem,
  getItem,
  getUserItems,
  updateItem,
}
