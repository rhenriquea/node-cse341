const model = require('../../models/pokemon');

exports.getPokemons = async (page, callback) => {
  const limit = 10;
  const offset = limit * (page - 1);
  model.pokemonsList(offset, limit, (data) => callback(data));
};
