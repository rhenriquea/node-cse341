const { ObjectID }  = require('mongodb');
const { getDb }  = require('../database');
class Product {
  
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  async save() {
    const db = getDb();
    return db
      .collection('products')
      .insertOne(this);
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray();
  }

  static find(productId) {
    const db = getDb();
    return db
      .collection('products')
      .find({ _id: new ObjectID(productId) })
      .next();
  }

  static update(productId) {
    const db = getDb();
    return db
      .collection('products')
      .updateOne(
        { _id: new ObjectID(productId) }, 
        { $set: this }
      );
  }

  static delete(productId) {
    const db = getDb();
    return db
      .collection('products')
      .deleteOne({ _id: new ObjectID(productId) });
  }
}

module.exports = Product;