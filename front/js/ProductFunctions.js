import { Product } from "./ProductTools.js";
import { GetProductFromAPI } from "./APIFunctions.js";

// Get URL and parse parameter to get ID field
let UrlParams = new URLSearchParams(document.location.search);
let productID = UrlParams.get("id");
let canape = new Product();

async function main() {
  // Request API product with previously retrieved ID
  var productJSON = await GetProductFromAPI(productID);
  // Set Product params
  canape = new Product(productJSON.colors, productJSON._id, productJSON.name, productJSON.price, productJSON.imageUrl, productJSON.description, productJSON.altTxt);

  // Set canape image
  document.querySelector(".item__img").innerHTML += `<img src="${canape.imageUrl}" alt="${canape.altTxt}">`;
  // Set canape name
  document.getElementById('title').innerHTML += canape.name;
  // Set canape price
  document.getElementById('price').innerHTML += canape.price;
  // Set canape description
  document.getElementById('description').innerHTML += canape.description;
  // Set canape colors
  canape.colors.forEach( color => document.getElementById('colors').innerHTML += `<option value="${color}">${color}</option>`);


}

main();
