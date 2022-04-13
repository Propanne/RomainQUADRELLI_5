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
    // Construct html template
    var aTag = document.createElement('a');
    var articleTag = document.createElement('article');
    var imgTag = document.createElement('img');
    var h3Tag = document.createElement('h3');
    var imgTag = document.createElement('img');
    var pTag = document.createElement('p');

    // Modify attributes, inner content etc
    aTag.setAttribute("href",'./product.html?id='+product.id);
    imgTag.setAttribute("src",product.imageUrl);
    imgTag.setAttribute("alt",product.altTxt)
    h3Tag.innerText=product.name;
    pTag.innerText=product.description;

    articleTag.appendChild(h3Tag);
    articleTag.appendChild(imgTag);
    articleTag.appendChild(pTag);

    aTag.appendChild(articleTag);

    items.appendChild(aTag);
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
