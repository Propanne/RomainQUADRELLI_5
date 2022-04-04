import { Product } from "./ProductTools.js";
import { GetProductFromAPI } from "./APIFunctions.js";

// Get URL and parse parameter to get ID field
let UrlParams = new URLSearchParams(document.location.search);
let productID = UrlParams.get("id");
let canape = new Product();

async function main() {
  // Request API product with previously retrieved ID
  var productJSON = await GetProductFromAPI(productID);
  canape = new Product(productJSON.colors, productJSON._id, productJSON.name, productJSON.price, productJSON.imageUrl, productJSON.description, productJSON.altTxt);

}

main();
