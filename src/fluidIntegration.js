const BASE_URL = "http://192.168.1.143:5000/api";

function getData() {
  const complete_url = BASE_URL + "/";
  return fetch(complete_url);
}

function selectPatch(id) {
  const complete_url = BASE_URL + "/select_patch/" + id;
  return fetch(complete_url);
}

function selectBank(id) {
  const complete_url = BASE_URL + "/select_bank/" + id;
  return fetch(complete_url);
}
function shutdown() {
   const complete_url = BASE_URL + "/shutdown/";
   return fetch(complete_url);
}
function getSetting(option) {

  const complete_url = BASE_URL + "/fluid_setting/synth." + option;
  return fetch(complete_url);
}
function setSetting(option, newValue) {
  
  const complete_url = BASE_URL + "/fluid_setting/synth." + option;
  const requestOptions = {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    body: newValue.toString()
  };
  return fetch(complete_url, requestOptions);
}

  

export { getData, selectBank, selectPatch, shutdown, getSetting, setSetting };
