const list = document.querySelector('#quote-list');
const form = document.querySelector('#new-quote-form');

document.addEventListener('DOMContentLoaded', () => {
    getQuotes();

    form.addEventListener('submit', handlePost)
});

const getQuotes = () => {
    axios.get('http://localhost:3000/quotes?_embed=likes')
        .then(res => {
            for (let quote of res.data) {
                createQuote(quote);
            }
        })
        .catch(err => console.log(err));
}

const postQuote = quote => {
    axios.post('http://localhost:3000/quotes?_embed=likes', quote)
        .then(res => {
            const li = createQuote(res.data);
            list.appendChild(li);
        })
        .catch(err => console.log(err));
}

const deleteQuote = quote => {
    axios.get(`http://localhost:3000/likes/${quote.id}`)
        .then(res => console.log(res.data))
}

const createQuote = quote => {
    const li = document.createElement('li');
    const blockquote = document.createElement('blockquote');
    const p = document.createElement('p');
    const footer = document.createElement('footer');
    const br = document.createElement('br');
    const likeBtn = document.createElement('button');
    const span = document.createElement('span');
    const deleteBtn = document.createElement('button');

    li.className = 'quote-card';
    li.id = quote.id;
    blockquote.className = 'blockquote';
    p.className = 'mb-0';
    p.innerText = quote.quote;
    footer.className = 'blockquote-footer';
    footer.innerText = quote.author;
    
    likeBtn.className = 'btn-success';
    likeBtn.innerText = 'Likes: ';
    span.innerText = 0;
    likeBtn.appendChild(span);
    deleteBtn.className = 'btn-danger';
    deleteBtn.innerText = 'Delete';

    //! Event handlers for like and del buttons
    deleteBtn.addEventListener('click', () => deleteQuote(quote))

    blockquote.append(p, footer, br, likeBtn, deleteBtn);
    li.appendChild(blockquote);
    list.appendChild(li);
}

const handlePost = (e) => {
    e.preventDefault();
    if (e.target.quote.value !== "" && e.target.author.value !== "") {
        const newQuote = {
            quote: e.target.quote.value,
            author: e.target.author.value
        }
        postQuote(newQuote);
        e.target.quote.value = "";
        e.target.author.value = "";
    }
}