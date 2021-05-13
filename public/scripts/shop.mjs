const addToCartBtn = document.getElementById('add-to-cart');

addToCartBtn.addEventListener('click', () => {
  e.preventDefault();
  await axios.post('/prove/week02/addBooks', allBooks);
});