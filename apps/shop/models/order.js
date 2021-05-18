const { Schema, model } = require('mongoose');

const schema = new Schema({
    products: [{
        product: { type: Object, required: true },
        quantity: { type: Number, required: true },
    }],
    user: {
      username: { type: String, required: true },
      userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    }
});

module.exports = model('Order', schema)