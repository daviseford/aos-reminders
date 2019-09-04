import request from 'superagent'
import { ISavedArmy } from 'types/savedArmy'

const devEndpoint = `https://bgj1fpqcj6.execute-api.us-east-1.amazonaws.com/dev`

interface ICreateItems {
  userName: string
  [key: string]: any
}

interface ICreateSavedArmy extends ISavedArmy {
  userName: string
}

const createItem = (data: ICreateItems) => request.post(`${devEndpoint}/items`).send(data)
const createSavedArmy = (data: ICreateSavedArmy) => request.post(`${devEndpoint}/items`).send(data)
const deleteItem = (id: string, userName: string) => request.delete(`${devEndpoint}/items/${id}/${userName}`)
const getItem = (id: string) => request.get(`${devEndpoint}/items/${id}`)
const getUserItems = (userName: string) => request.get(`${devEndpoint}/user/${userName}`)
const updateItem = (id: string, data: ICreateSavedArmy) =>
  request.put(`${devEndpoint}/items/${id}`).send(data)

export const PreferenceApi = {
  createItem,
  createSavedArmy,
  deleteItem,
  getItem,
  getUserItems,
  updateItem,
}
