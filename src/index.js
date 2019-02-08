document.addEventListener('DOMContentLoaded', setUpPage)

const quoteContainer = document.querySelector('#quote-list')
const quoteForm = document.querySelector('#new-quote-form')
const url = 'http://localhost:3000/quotes'

function setUpPage() {
  renderAllQuotes()
  addFormHandler()
}

function getQuotes() {
  return fetch(url).then(res => res.json())
}

function renderAllQuotes() {
  quoteContainer.innerHTML = ""
  getQuotes().then(function(data){
    data.forEach(renderQuote)
  })
}

function renderQuote(quote) {
  const quoteCard = document.createElement('li')
  quoteCard.className = 'quote-card'
  quoteContainer.appendChild(quoteCard)

    const blockquote = document.createElement('blockquote')
    blockquote.className = 'blockquote'
    quoteCard.appendChild(blockquote)

      const actualQuote = document.createElement('p')
      actualQuote.textContent = quote.quote
      blockquote.appendChild(actualQuote)

      const quoteAuthor = document.createElement('blockquote')
      quoteAuthor.textContent = quote.author
      quoteAuthor.className = 'blockquote-footer'
      blockquote.appendChild(quoteAuthor)

      const likeBtn = document.createElement('button')
      likeBtn.textContent = 'Likes: '
      likeBtn.className = 'btn-success'
      likeBtn.dataset.id = quote.id
      blockquote.appendChild(likeBtn)

        const likeNumber = document.createElement('span')
        likeNumber.textContent = quote.likes
        likeNumber.className = 'likes-number'
        likeBtn.appendChild(likeNumber)

      const deleteBtn = document.createElement('button')
      deleteBtn.textContent = 'Delete'
      deleteBtn.className = 'btn-danger'
      blockquote.appendChild(deleteBtn)

  likeBtn.addEventListener('click', likeQuote)
  deleteBtn.addEventListener('click', () => removeQuote(quote))
}

function addFormHandler() {
    const quoteName = document.querySelector('#new-quote')
    quoteName.name = 'quote'

    const authorName = document.querySelector('#author')
    authorName.name = 'author'

    quoteForm.addEventListener('submit', newQuote)
}

function newQuote() {
    event.preventDefault()

    let newQuote = event.target.quote.value
    let newAuthor = event.target.author.value

    createQuote(newQuote, newAuthor).then(renderQuote)

    event.target.reset()
}

function createQuote(newQuote, newAuthor) {
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            quote: newQuote,
            author: newAuthor
        })
    }).then(res => res.json())
}

function removeQuote(quote) {
    const targetCard = event.target.parentElement.parentElement
    targetCard.parentElement.removeChild(targetCard)

    let id = quote.id
    deleteQuote(id)
}

function deleteQuote(id) {

    return fetch(`${url}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    })
}

function likeQuote() {
    // better way to do this?
    let newLikes = parseInt(event.target.querySelector('span').textContent)

    newLikes++

    event.target.querySelector('span').textContent = newLikes

    let id = event.target.dataset.id
    updateLikes(id, newLikes)
}

function updateLikes(id, newLikes) {
    return fetch(`${url}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            id: id,
            likes: newLikes
        })
    })
}
