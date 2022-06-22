export const storageService = {
  save: saveToStorage,
  load: loadFromStorage,
}

function saveToStorage(key, val) {
  const str = JSON.stringify(val)
  localStorage.setItem(key, str)
}

function loadFromStorage(key) {
  const str = localStorage.getItem(key)
  return JSON.parse(str)
}
