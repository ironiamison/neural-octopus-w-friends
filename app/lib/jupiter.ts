import axios from 'axios'

export const jupiterApi = axios.create({
  baseURL: 'https://price.jup.ag',
  timeout: 5000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
}) 