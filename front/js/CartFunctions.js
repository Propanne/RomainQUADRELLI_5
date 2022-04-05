import { Product } from "./ProductTools.js";
import { GetAllProductsFromAPI, GetProductFromAPI } from "./APIFunctions.js";

// Global variable definition
let cartPrice = 0;
let cartArticlesQuantity = 0;

// This function return the list of all products
async function GetProductCatalog(){
  return GetAllProductsFromAPI("http://localhost:3000/api/products/");
}

// Function that display products in cart
async function DisplayCart(productList, cartList){
  // Loop on products ID in cart
  productList.forEach( product => {
    if (cartList[product._id]){
      // Loop on product ID + color in cart
      for (var color in cartList[product._id]) {
        var articleTemplate = `
          <article class="cart__item" data-id="${product._id}" data-color="${color}">
            <div class="cart__item__img">
              <img src="${product.imageUrl}" alt="${product.altTxt}">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${product.name}</h2>
                <p>${color}</p>
                <p>${product.price} €</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartList[product._id][color]}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>
          </article>`
        // Add product * quantity to cartPrice
        // Add product quantity to total article quantity
        // Display current product in cart
        cartPrice += parseInt(product.price) * cartList[product._id][color]
        cartArticlesQuantity += cartList[product._id][color];
        document.getElementById('cart__items').innerHTML += articleTemplate;
      }
    }
  });
}

// Function that display total price and total articles in cart
function DisplayTotalCartInformations(){
  document.getElementById('totalQuantity').innerHTML = cartArticlesQuantity;
  document.getElementById('totalPrice').innerHTML = cartPrice;
}

// Function that remove item from cart
function RemoveItem(tag) {
  // Get article parent element of 'supprimer' button
  // Get itemID from "data-id" attribute and color from article child element
  // Remove the key:value id:color from cartList | remove cartList[id] if empty
  // Corresponding article
  var cartList = tag.target.cartList;
  var articleParent = tag.target.closest("article");
  var itemID = articleParent.getAttribute("data-id");
  var itemColor = articleParent.querySelector('div.cart__item__content__description > p').innerHTML;
  var itemQuantity = cartList[itemID][itemColor];
  var itemPrice = articleParent.querySelector('div.cart__item__content__description :nth-child(3)').innerHTML;;

  // Remove color:quantity from cartList[id]
  if(cartList[itemID] && cartList[itemID][itemColor]){ delete cartList[itemID][itemColor]; }
  // Remove cartList[id] if empty
  if(cartList[itemID] && Object.keys(cartList[itemID]).length === 0){ delete cartList[itemID]}
  // Remove article from cart list
  articleParent.remove();
  // Update localStorage cartList with new cart
  localStorage.setItem("cartList", JSON.stringify(cartList));

  // Update global cart informations
  cartPrice -= parseInt(itemQuantity) * parseInt(itemPrice);
  cartArticlesQuantity -= parseInt(itemQuantity);
  DisplayTotalCartInformations();
}

async function main() {
  // Set variables
  var cartList = JSON.parse(localStorage.getItem('cartList'));
  var productList = await GetProductCatalog();

  // Display all product in cart and total cart informations
  await DisplayCart(productList, cartList);
  DisplayTotalCartInformations();

  // Add Listener event on 'supprimer' button
  var removeButtons = document.getElementsByClassName('deleteItem');
  Array.from(removeButtons).forEach( button => {
    button.cartList = cartList;
    button.addEventListener("click", RemoveItem);
  });
}
main();
