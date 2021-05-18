const { Schema, model } = require('mongoose');

const schema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  resetToken: { type: String },
  resetTokenExpiration: { type: Date },
  cart: {
    items: [
      {
        productData: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

schema.methods.addToCart = function (productId) {
  if (!this.cart) this.cart = { items: [] };

  let quantity = 1;

  const productIndex = this.cart.items.findIndex(
    (p) => p.productData.toString() === productId.toString()
  );
  const updatedItems = [...this.cart.items];

  if (productIndex >= 0) {
    quantity = this.cart.items[productIndex].quantity + 1;
    updatedItems[productIndex].quantity = quantity;
  } else {
    const newItem = { productData: productId, quantity };
    updatedItems.push(newItem);
  }

  this.cart = { items: updatedItems };

  return this.save();
};

schema.methods.getCartProductsAmount = function () {
  return this.cart.items.reduce((acc, item) => acc + item.quantity, 0);
};

schema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(
    (item) => item.productData.toString() !== productId.toString()
  );

  this.cart = { items: updatedCartItems };

  return this.save();
};

schema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = model('User', schema);
