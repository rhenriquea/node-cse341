const axios = require('axios');

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

exports.pokemonsList = async (offset, limit, callback) => {
  const { data } = await axios.get(
    `${BASE_URL}?limit=${limit}&offset=${offset}`
  );
  callback(data);
};
