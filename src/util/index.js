function getStore(key = 'gradients') {
  var data = window.localStorage.getItem(key);
  try {
    data = JSON.parse(data);
  } catch (err) { console.log(err) }
  return data;
}

function setStore(obj, key = 'gradients') {
  if (typeof obj === 'object') {
    obj = JSON.stringify(obj);
  }
  return window.localStorage.setItem(key, obj);
}

function dataURIToURL(dataURI) {
  var binStr = atob(dataURI.split(',')[1]),
    len = binStr.length,
    arr = new Uint8Array(len);

  for (var i = 0; i < len; i++) {
    arr[i] = binStr.charCodeAt(i);
  }

  return URL.createObjectURL(new Blob([arr]));
}

export {
  getStore,
  setStore,
  dataURIToURL,
}