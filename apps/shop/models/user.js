const { ObjectID } = require('mongodb');
const { getDb } = require('../../../database');

class User {
    constructor(username, email, cart, _id) {
        this.username = username;
        this.email = email;
        this.cart = cart;
        this._id = _id;
    }

    async save() {
        const db = getDb();
        return db
            .collection('users')
            .insertOne(this);
    }

    static find(userId) {
        const db = getDb();
        return db
            .collection('users')
            .find({ _id: new ObjectID(userId) })
            .next();
    }

    addToCart(productId) {
        if (!this.cart) {
            this.cart = { items: [] }
        }

        const productIndex = this.cart.items.findIndex((p => p.productId.toString() === productId.toString()));
        const updatedItems = [...this.cart.items]

        let amount = 1;

        if (productIndex >= 0) {
            amount = this.cart.items[productIndex].amount + 1;
            updatedItems[productIndex].amount = amount;
        } else {
            const newItem = { productId: new ObjectID(productId), amount };
            updatedItems.push(newItem)
        }

        const updatedCart = { items: updatedItems }

        const db = getDb();
        return db.collection('users').updateOne({ _id: ObjectID(this._id) }, { $set: { cart: updatedCart } })
    }

    removeFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !== productId.toString());
        const updatedCart = { items: updatedCartItems }
        const db = getDb();
        return db.collection('users').updateOne({ _id: ObjectID(this._id) }, { $set: { cart: updatedCart } })
    }

    async getCart() {
      const db = getDb();
      const productIds = this.cart.items.map(p => p.productId);
      
      let products = await db
        .collection('products')
        .find({_id: {$in: productIds}})
        .toArray();

      products = products.map((p) => {
        return {
          ...p,
          quantity: this.cart.items.find(i => i.productId.toString() === p._id.toString()).amount
      }});
      
      return products;
    }

    getCartProductsAmount() {
        return this.cart.items.reduce((acc, item) => {
            return acc + item.amount;
        }, 0);
    }
}

module.exports = User;