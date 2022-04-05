import { GetAllProductsFromAPI } from "./APIFunctions.js";
import { Product } from "./ProductTools.js";

// Variable declaration
let allProductsJSON;
let allProducts = [];

function DisplayAll(products) {
  // Get products container
  var items = document.querySelector('#items');
  // Iterate over Products array
  products.forEach( product => {
    items.innerHTML += `
      <a href="./product.html?id=${product.id}">
        <article>
          <img src="${product.imageUrl}" alt="${product.altTxt}">
          <h3 class="productName">${product.name}</h3>
          <p class="productDescription">${product.description}</p>
        </article>
      </a>`;
  });
}

async function main() {
  // Get all products from API
  allProductsJSON = await GetAllProductsFromAPI("http://localhost:3000/api/products/");
  // Parse JSON file to an array of Product class
  allProductsJSON.forEach( product => allProducts.push(new Product(product.colors, product._id, product.name, product.price, product.imageUrl, product.description, product.altTxt)));
  DisplayAll(allProducts);
}

main();
