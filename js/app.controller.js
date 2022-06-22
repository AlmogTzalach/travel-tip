import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

export const mapController = {
	renderLocsTable,
}

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onSearchAddress = onSearchAddress
window.onDeleteLoc = onDeleteLoc

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
			document.querySelector(
				'.user-pos'
			).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
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
                            <button onclick="onPanTo(${loc.lat}, ${loc.lng})">Go</button>
                            <button onclick="onDeleteLoc('${loc.id}')">Delete</button>
                        </div>`
		})
		document.querySelector('.loc-table').innerHTML = strHTML
	})
}
