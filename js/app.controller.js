import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onSearchAddress = onSearchAddress

function onInit() {
  mapService
    .initMap()
    .then(() => {
      console.log('Map is ready')
    })
    .catch(() => console.log('Error: cannot init map'))

  renderLocsTable()
}

function onSearchAddress(ev) {
  ev.preventDefault()
  const address = document.querySelector('input').value
  locService.getSearchLoc(address).then((latLng) => {
    const marker = mapService.addMarker(latLng, address)
    locService.addLoc(marker)
    onPanTo(latLng.lat, latLng.lng)
  })
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log('Getting Pos')
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

function onAddMarker() {
  console.log('Adding a marker')
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
  locService.getLocs().then((locs) => {
    console.log('Locations:', locs)
    document.querySelector('.locs').innerText = JSON.stringify(locs)
  })
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
      console.log('User position is:', pos.coords)
      onPanTo(pos.coords.latitude, pos.coords.longitude)
    })
    .catch((err) => {
      console.log('err!!!', err)
    })
}

function onPanTo(lat, lng) {
  console.log('Panning the Map')
  mapService.panTo(lat, lng)
}

function onDeleteLoc(id) {
  locService.deleteLoc(id)
  renderLocsTable()
}

function renderLocsTable() {
  locService.getLocs().then((locs) => {
    let strHTML = ''
    locs.forEach((loc) => {
      strHTML += `<div class="loc-line">
                            <div>${loc.name}</div>
                            <button onclick="onPanTo(${loc.lat}, ${loc.lng})">Go</button>
                            <button onclik="onDeleteLoc(${loc.id})">Delete</button>
                        </div>`
    })
    document.querySelector('.loc-table').innerHTML = strHTML
  })
}
