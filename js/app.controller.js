import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

export const mapController = {
  renderLocsTable,
  setQueryStringParams,
}

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onSearchAddress = onSearchAddress
window.onDeleteLoc = onDeleteLoc
window.onCopyURL = onCopyURL

const queryStringParams = new URLSearchParams(window.location.search)

function onInit() {
  const loc = getQueryStringParams()

  mapService
    .initMap(loc.lat, loc.lng)
    .then(() => {
      console.log('Map is ready')
    })
    .catch(() => console.log('Error: cannot init map'))

  renderLocsTable()
}

function setQueryStringParams(lat, lng) {
  const queryStringParams = `?lat=${lat}&lng=${lng}`
  const newUrl =
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname +
    queryStringParams
  window.history.pushState({ path: newUrl }, '', newUrl)
}

function getQueryStringParams() {
  const queryStringParams = new URLSearchParams(window.location.search)
  const lat = queryStringParams.get('lat') || undefined
  const lng = queryStringParams.get('lng') || undefined
  return { lat, lng }
}

function onCopyURL(elBtn) {
  navigator.clipboard.writeText(window.location.href)
  elBtn.innerText = 'Copied!'
  setTimeout(() => {
    const elBtn = document.querySelector('.btn-copy-url')
    elBtn.innerText = 'Copy URL'
  }, 1500)
}

function onSearchAddress(ev) {
  ev.preventDefault()
  const address = document.querySelector('input').value
  locService.getSearchLoc(address).then((latLng) => {
    const marker = mapService.addMarker(latLng, address)
    locService.addLoc(marker)
    onPanTo(latLng.lat, latLng.lng)
    renderLocsTable()
  })
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

function onAddMarker() {
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
  locService.getLocs().then((locs) => {
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
                            <div class="loc-btns">
                                <button onclick="onPanTo(${loc.lat}, ${loc.lng})">Go</button>
                                <button onclick="onDeleteLoc('${loc.id}')">Delete</button>
                            </div>
                        </div>`
    })
    document.querySelector('.loc-table').innerHTML = strHTML
  })
}
