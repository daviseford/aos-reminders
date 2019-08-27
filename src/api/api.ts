import request from 'superagent'

const endpoint = ` https://bgj1fpqcj6.execute-api.us-east-1.amazonaws.com/dev`

// POST - endpoint/items
// GET - endpoint/items/{id}
// GET - endpoint/user/{userName}
// PUT - endpoint/items/{id}
// DELETE - endpoint/items/{id}

interface ICreateItems {
  id: string
  userName: string
  [key: string]: any
}

const createItem = (data: ICreateItems) => request.post(`${endpoint}/items`).send(data)
const deleteItem = (id: string) => request.delete(`${endpoint}/items/${id}`)
const getItem = (id: string) => request.get(`${endpoint}/items/${id}`)
const getUserItems = (userName: string) => request.get(`${endpoint}/user/${userName}`)
const updateItem = (id: string) => request.put(`${endpoint}/items/${id}`)

export const Api = {
  createItem,
  deleteItem,
  getItem,
  getUserItems,
  updateItem,
}
