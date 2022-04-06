import { Product } from "./ProductTools.js";
import { GetAllProductsFromAPI, GetProductFromAPI, PostCartCommand } from "./APIFunctions.js";

// Global variable definition
let cartPrice = 0;
let cartArticlesQuantity = 0;

// This function return the list of all products
async function GetProductCatalog(){
  return GetAllProductsFromAPI("http://localhost:3000/api/products/");
}

// Function that display products in cart
async function DisplayCart(productList, cartList){
  // Clear innerHTML
  document.getElementById('cart__items').innerHTML = '';
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

// Function that take care of quantity modifications
async function ModifyQuantity(tag){
  // Set variables
  var cartList = tag.target.cartList;
  var productList = tag.target.productList;
  var articleParent = tag.target.closest("article");
  var itemID = articleParent.getAttribute("data-id");
  var itemColor = articleParent.querySelector('div.cart__item__content__description > p').innerHTML;
  var itemQuantity = parseInt(tag.target.value);
  var previousQuantity = cartList[itemID][itemColor];
  var itemPrice = articleParent.querySelector('div.cart__item__content__description :nth-child(3)').innerHTML;;

  // Update global cart informations
  cartPrice = (cartPrice - parseInt(itemPrice) * previousQuantity) + parseInt(itemPrice) * itemQuantity;
  cartArticlesQuantity = (cartArticlesQuantity - previousQuantity) + itemQuantity;
  DisplayTotalCartInformations();

  // If quantity is not 0, modify quantity
  if(itemQuantity > 0) {
    cartList[itemID][itemColor] = itemQuantity;
  } else {
    // Remove color:quantity entry
    delete cartList[itemID][itemColor];
    if(cartList[itemID] && Object.keys(cartList[itemID]).length === 0){ delete cartList[itemID];}
    articleParent.remove();
  }
  // Update localStorage cartList with new cart
  localStorage.setItem("cartList", JSON.stringify(cartList));
}

// Function that verify fields info and trigger command
async function CommandVerification(item) {
  // Function that test is string is only alphabets
  function OnlyLetters(str){
    return /^[a-zA-Z]+$/.test(str);
  }

  // Prevent default behavior
  // Set variables
  event.preventDefault();
  var warningTags = document.getElementsByClassName('cart__order__form__question');
  var prenom = document.getElementById('firstName').value;
  var nom = document.getElementById('lastName').value;
  var adresse = document.getElementById('address').value;
  var ville = document.getElementById('city').value;
  var email = document.getElementById('email').value;
  var validFields = true;

  // Flush previous existing warnings
  Array.from(warningTags).forEach( tag => {
    tag.querySelector('.cart__order__form__question > p').innerHTML = '';
  });

  // Verify is input are legit
  if(!OnlyLetters(prenom)){validFields = false; document.getElementById('firstNameErrorMsg').innerHTML = "Sélectionnez un prenom valide.";}
  if(!OnlyLetters(nom)){validFields = false; document.getElementById('lastNameErrorMsg').innerHTML = "Sélectionnez un nom valide.";}
  if(/[^a-zA-Z0-9]+$/.test(adresse)){validFields = false; document.getElementById('addressErrorMsg').innerHTML = "Sélectionnez une adresse valide.";}
  if(!OnlyLetters(ville)){validFields = false; document.getElementById('cityErrorMsg').innerHTML = "Sélectionnez un ville valide.";}
  if(!/.*@.*\..*/.test(email)){validFields = false; document.getElementById('emailErrorMsg').innerHTML = "Sélectionnez une adresse mail valide.";}

  // If command is valid and buyer information are valids
  if(validFields){
    // Setting up buyer variable and productID in cart array
    // Create data dictionnary to send
    var productsID = [];
    for(var id in item.target.cartList){
      productsID.push(id);
    }
    var postData = {
      contact: {
        firstName: prenom,
        lastName: nom,
        address: adresse,
        city: ville,
        email: email
      },
      products: productsID
    };

    var apiResponse = await PostCartCommand(postData);
    localStorage.setItem('commandInfos', JSON.stringify(apiResponse));
    // Redirect to cart confirmation
    // document.location.href="http://localhost/P5_QUADRELLI_Romain/front/html/confirmation.html";
  }
}

async function main() {
  // Set variables
  var cartList = JSON.parse(localStorage.getItem('cartList'));
  var productList = await GetProductCatalog();

  // Display all product in cart and total cart informations
  await DisplayCart(productList, cartList);
  DisplayTotalCartInformations();

  // Add event listener on 'supprimer' buttons
  var removeButtons = document.getElementsByClassName('deleteItem');
  Array.from(removeButtons).forEach( button => {
    button.cartList = cartList;
    button.addEventListener('click', RemoveItem);
  });
  // Add event listener on 'itemQuantity' buttons
  var quantityButtons = document.getElementsByClassName('itemQuantity');
  Array.from(quantityButtons).forEach( input => {
    input.cartList = cartList;
    input.productList = productList;
    input.addEventListener('input', ModifyQuantity);
  });
  // Add event listener on 'commander ! ' button
  document.getElementById('order').cartList = cartList;
  document.getElementById('order').addEventListener("click", CommandVerification);
}
main();
