import request from 'superagent'
import { ISavedArmy } from 'types/savedArmy'
import { isDev } from 'utils/env'

const devEndpoint = `https://bgj1fpqcj6.execute-api.us-east-1.amazonaws.com/dev`
const prodEndpoint = `https://mzrv8apqrd.execute-api.us-east-1.amazonaws.com/prod`

const endpoint = isDev ? devEndpoint : prodEndpoint

interface ICreateItems {
  userName: string
  [key: string]: any
}

interface ICreateSavedArmy extends ISavedArmy {
  userName: string
}

interface IUpdateItems {
  [key: string]: any
}

const createItem = (data: ICreateItems) => request.post(`${endpoint}/items`).send(data)
const createSavedArmy = (data: ICreateSavedArmy) => request.post(`${endpoint}/items`).send(data)
const deleteItem = (id: string, userName: string) => request.delete(`${endpoint}/items/${id}/${userName}`)
const getItem = (id: string) => request.get(`${endpoint}/items/${id}`)
const getUserItems = (userName: string) => request.get(`${endpoint}/user/${userName}`)
const updateItem = (id: string, data: IUpdateItems) =>
  request.post(`${endpoint}/update/`).send({ ...data, id })

export const PreferenceApi = {
  createItem,
  createSavedArmy,
  deleteItem,
  getItem,
  getUserItems,
  updateItem,
}
