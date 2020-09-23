import request from 'superagent'
import { ICurrentArmy } from 'types/army'
import { TImportFileTypes, TImportParsers } from 'types/import'
import { ISavedArmy } from 'types/savedArmy'
import { isDev } from 'utils/env'

const devEndpoint = `https://bgj1fpqcj6.execute-api.us-east-1.amazonaws.com/dev`
const prodEndpoint = `https://mzrv8apqrd.execute-api.us-east-1.amazonaws.com/prod`

const api = isDev ? devEndpoint : prodEndpoint

interface ICreateError {
  fileTxt: string | string[]
  fileType: TImportFileTypes
  parser: TImportParsers
}

interface ICreateItem {
  userName: string
  [key: string]: any
}

interface ICreateSavedArmy extends ISavedArmy {
  userName: string
}

interface IUpdateItem {
  [key: string]: any
}

const createErrorFile = (data: ICreateError) => request.post(`${api}/errors`).send(data)
const createItem = (data: ICreateItem) => request.post(`${api}/items`).send(data)
const createLink = (data: Record<string, any>) => request.post(`${api}/links`).send(data)
const createSavedArmy = (data: ICreateSavedArmy) => request.post(`${api}/items`).send(data)
const deleteItem = (id: string, userName: string) => request.delete(`${api}/items/${id}/${userName}`)
const getItem = (id: string) => request.get(`${api}/items/${id}`)
const getLinkedArmy = (id: string) => request.get(`${api}/links/${id}`)
const getUserItems = (userName: string) => request.get(`${api}/user/${userName}`)
const saveArmyToS3 = (data: ICurrentArmy) => request.post(`${api}/save`).send(data)
const updateItem = (id: string, data: IUpdateItem) => request.post(`${api}/update/`).send({ ...data, id })

export const PreferenceApi = {
  createErrorFile,
  createItem,
  createLink,
  createSavedArmy,
  deleteItem,
  getItem,
  getLinkedArmy,
  getUserItems,
  saveArmyToS3,
  updateItem,
}
