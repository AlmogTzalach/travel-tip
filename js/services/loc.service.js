import { storageService } from './storage.service.js'
import { utilService } from './util.service.js'
import { mapService } from './map.service.js'

export const locService = {
	addLoc,
	load: loadLocsFromStorage,
	getLocs,
	getSearchLoc,
}

const STORAGE_KEY = 'locationsDB'

const locs = storageService.load(STORAGE_KEY) || []
// [
// 	{ name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
// 	{ name: 'Neveragain', lat: 32.047201, lng: 34.832581 },
// ]

const gMarkers = {}

function loadLocsFromStorage() {
	if (!locs) return

	locs.forEach((loc) => {
		const latLng = { lat: loc.lat, lng: loc.lng }
		mapService.addMarker(latLng, loc.name)
	})
}

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

function addLoc(marker) {
	const id = utilService.makeId()
	locs.push({
		id,
		name: marker.title,
		lat: marker.position.lat(),
		lng: marker.position.lng(),
	})

	storageService.save(STORAGE_KEY, locs)

	gMarkers[id] = marker
}

function deleteLoc(id) {
	gMarkers[id]
}
