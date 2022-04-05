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

function AddTocart() {
  // Sample of content:
  // cartList = { "productID": { "blue": 4, "pink": 3}}
  var cartList = {};
  // Parse item options
  var itemQuantity = parseInt(document.getElementById('quantity').value);
  var itemColor = document.getElementById('colors').value;
  // Verify that a color has been selected
  if(itemColor !== "") {
    document.querySelector('.item__content__settings__color > label').style.color = '#FFFFFF';
    // Verify if objet already exists in localStorage
    if(localStorage.getItem('cartList')) {
      // Get existing localStorage variable for this item
      // Add existing quantity to the new quantity
      cartList = JSON.parse(localStorage.getItem("cartList"));
      // Test if product id is in the cartList dictionnay
      if (cartList[productID]){
        // Test if quantity is null / add existing quantity to the new quantity
        if(cartList[productID][itemColor]){
          cartList[productID][itemColor] += itemQuantity;
        } else {
          cartList[productID][itemColor] = itemQuantity;
        }
      } else {
        cartList[productID] = { [itemColor] : parseInt(itemQuantity)};
      }
      // Updating the localStorage variable
      localStorage.setItem("cartList", JSON.stringify(cartList));
    } else{
      cartList[productID] = { [itemColor] : parseInt(itemQuantity) };
      // Set new localStorage variable
      localStorage.setItem("cartList", JSON.stringify(cartList));
    }
  // If no color is selected
  } else{
    document.querySelector('.item__content__settings__color > label').style.color = '#FF0000';
  }
}

main();
document.getElementById('addToCart').addEventListener("click", AddTocart);
