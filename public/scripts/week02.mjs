const form = document.querySelectorAll('form#books')[0];
const addedListSection = document.getElementsByClassName('added-list-section')[0];
const booksList = document.getElementById('addedBooks');
const saveBookBtn = document.getElementById('saveBtn');


const allBooks = [];

form.addEventListener('submit', addBook);
saveBookBtn.addEventListener('click', save);

function addBook(e) {
    e.preventDefault();

    const { title, summary, imgUrl } = form.elements;

    const book = {
        title: title.value,
        summary: summary.value,
        imgUrl: imgUrl.value || '/images/no_image.png'
    }

    allBooks.push(book);

    addedListSection.classList.remove('hidden');

    const li = document.createElement('li');
    li.classList.add('list-group-item');

    const h6 = document.createElement('h6');
    h6.classList = ['font-weight-bold m-0']

    const p = document.createElement('p');
    p.classList = ['small m-0']

    h6.textContent = book.title;
    p.textContent = book.summary;

    li.appendChild(h6);
    li.appendChild(p);

    booksList.appendChild(li);

    title.value = '';
    summary.value = '';
}


async function save(e) {
    e.preventDefault();

    const books = allBooks.map((book) => axios.post('/prove/week02/addBook', book));

    await Promise.all(books);

    window.location.replace('/prove/week02/books');

}