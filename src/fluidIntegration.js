const BASE_URL = "http://192.168.1.143:5000/api"


function getData(){
   const complete_url = BASE_URL + "/";
   return fetch(complete_url)
}

function selectPatch(id){
    const complete_url = BASE_URL + "/select_patch/" + id;
    return fetch(complete_url)
 }

 function selectBank(id){
    const complete_url = BASE_URL + "/select_bank/" + id;
    return fetch(complete_url)
 }

export {getData, selectBank, selectPatch};