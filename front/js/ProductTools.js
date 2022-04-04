class Product {
  constructor(colors, id, name, price, imageUrl, description, altTxt){
    this.colors = colors;
    this.id = id;
    this.name = name;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this.altTxt = altTxt;
  }
}

class CardItem {
  constructor(name, color, quantity){
    this.itemName = name;
    this.color = color;
    this.quantity = quantity;
  }
}
export { Product, CardItem };
