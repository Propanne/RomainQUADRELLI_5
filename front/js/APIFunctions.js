// Import Product class
import { Product } from "./ProductFunctions.js";

// Variable that store all products
let allProductsJSON;
let allProducts = [];

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

async function main() {
  // Get all products from API
  allProductsJSON = await GetAllProductsFromAPI("http://localhost:3000/api/products/");
  // Parse JSON file to an array of Product class
  allProductsJSON.forEach( product => allProducts.push(new Product(product.colors, product._id, product.name, product.price, product.imageUrl, product.description, product.altTxt)));
  console.log(allProducts);
}

main();
