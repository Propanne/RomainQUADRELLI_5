import { Product, CardItem } from "./ProductTools.js";
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

function AddToCard() {
  var cardList = {};
  // Parse item options
  var itemQuantity = parseInt(document.getElementById('quantity').value);
  var itemColor = document.getElementById('colors').value;
  // Verify that a color has been selected
  if(itemColor !== "") {
    var cardItem = new CardItem(canape.name, itemColor, itemQuantity);
    // Verify if objet already exists in localStorage
    if(localStorage.getItem(canape.name+"_"+itemColor)){
      console.log("Object exists");
      // Get existing localStorage variable for this item
      // Add existing quantity to the new quantity
      var existingItemQuantity = JSON.parse(localStorage.getItem(canape.name+"_"+itemColor)).quantity;
      cardItem.quantity += parseInt(existingItemQuantity);
      // Updating the localStorage variable
      localStorage.setItem(canape.name+"_"+itemColor, JSON.stringify(cardItem));
    } else{
      console.log("Object not existing");
      // Set new localStorage variable
      localStorage.setItem(canape.name+"_"+itemColor, JSON.stringify(cardItem));
    }


  } else{
    document.querySelector('.item__content__settings__color > label').style.color = '#FF0000';
  }
}

main();
document.getElementById('addToCart').addEventListener("click", AddToCard);
