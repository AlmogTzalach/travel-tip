import { storageService } from './storage.service.js'

export const locService = {
  getLocs,
  getSearchLoc,
}

const locs = [
  { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
  { name: 'Neveragain', lat: 32.047201, lng: 34.832581 },
]

function getSearchLoc(address) {
  const API_KEY = 'AIzaSyBS1RGUGXqbyr9Ry8oWmOOd5nQMSP7sgBk'
  // address = address.replaceAll(' ', '+')

  return fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`
  )
    .then((res) => res.json())
    .then((res) => res.results[0].geometry.location)
}

function getLocs() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(locs)
    }, 2000)
  })
}
