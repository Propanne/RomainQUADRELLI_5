// Function that retrieve all products from API
async function GetAllProductsFromAPI(url) {
  var response = await fetch(url);
  if (response.ok){
    let data = await response.json();
    return data;
  }
  else {
    return "Error while retrieving API products.";
  }
}

async function GetProductFromAPI(id) {
  var response = await fetch("http://localhost:3000/api/products/"+id);
  if (response.ok){
    let data = await response.json();
    return data;
  }
  else {
    return "Error while retrieving API products.";
  }
}
// URLSearchParams : parse l'URL de la page
// localStorage : stoque une données dans le stockage local du navigateur

async function PostCartCommand(postData){
  var headers = {
  method: "POST",
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify(postData)};
  var response = await fetch("http://localhost:3000/api/products/order", headers);
  if (response.ok){
    let data = await response.json();
    return data;
  }
  else {
    return "Error while retrieving API products.";
  }
}

export { GetAllProductsFromAPI, GetProductFromAPI, PostCartCommand };
