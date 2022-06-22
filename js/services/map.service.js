import { storageService } from './storage.service.js'
import { locService } from './loc.service.js'
import { mapController } from '../app.controller.js'

export const mapService = {
	initMap,
	addMarker,
	panTo,
}

var gMap

function initMap(lat = 32.0749831, lng = 34.9120554) {
	return _connectGoogleApi().then(() => {
		gMap = new google.maps.Map(document.querySelector('#map'), {
			center: { lat, lng },
			zoom: 15,
		})
		locService.load()

		// add listener for click on the map
		gMap.addListener('click', (clickEv) => {
			const marker = addMarker(clickEv.latLng, 'Hello World!')
			locService.addLoc(marker)
			mapController.renderLocsTable()
		})
	})
}

function addMarker(loc, title) {
	var marker = new google.maps.Marker({
		position: loc,
		map: gMap,
		title,
	})

	return marker
}

function panTo(lat, lng) {
	var laLatLng = new google.maps.LatLng(lat, lng)
	gMap.panTo(laLatLng)
}

function _connectGoogleApi() {
	if (window.google) return Promise.resolve()
	const API_KEY = 'AIzaSyBS1RGUGXqbyr9Ry8oWmOOd5nQMSP7sgBk'
	var elGoogleApi = document.createElement('script')
	elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
	elGoogleApi.async = true
	document.body.append(elGoogleApi)

	return new Promise((resolve, reject) => {
		elGoogleApi.onload = resolve
		elGoogleApi.onerror = () => reject('Google script failed to load')
	})
}
