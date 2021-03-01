const ul = document.querySelector('#quote-list');
const form = document.querySelector('#new-quote-form');

document.addEventListener('DOMContentLoaded', () => {
  getQuotes();

  form.addEventListener('submit', handlePost)
})

const getQuotes = async () => {
    const res = await axios.get('http://localhost:3000/quotes?_embed=likes');
    for (let quote of res.data) createQuote(quote);
}

const getLikes = async id => {
    const res = await axios.get('http://localhost:3000/likes');
    let count = 0;
    for (let like of res.data) {
        if (like.quoteId == id) count++;
    }
    const li = document.getElementById(id);
    const span = li.querySelector('span')
    span.innerText = count;
}

const postQuote = async quote => {
    const res = await axios.post('http://localhost:3000/quotes?_embed=likes', quote)
    createQuote(res.data);
}

const updateLikes = async quote => {
    const res = await axios.post(`http://localhost:3000/likes`, {
        quoteId: quote.id,
        createdAt: Math.floor((new Date()).getTime() / 1000)
    })
    const li = document.getElementById(quote.id);
    const span = li.querySelector('span')
    span.innerText = getLikes(quote.id)
}

const deleteQuote = async quote => {
    const res = await axios.delete(`http://localhost:3000/quotes/${quote.id}/?_embed=likes`)
    const li = document.getElementById(quote.id);
    li.remove();
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
    span.innerText = getLikes(li.id);
    deleteBtn.className = 'btn-danger';
    deleteBtn.innerText = 'Delete';

    likeBtn.addEventListener('click', () => updateLikes(quote))
    deleteBtn.addEventListener('click', () => deleteQuote(quote))

    likeBtn.appendChild(span);
    blockquote.append(p, footer, br, likeBtn, deleteBtn);
    li.appendChild(blockquote);
    ul.appendChild(li);
}

const handlePost = e => {
    e.preventDefault();
    const quote = {
        quote: e.target.quote.value,
        author: e.target.author.value
    }
    postQuote(quote);
    e.target.quote.value = ""
    e.target.author.value = ""
}