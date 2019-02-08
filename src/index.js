document.addEventListener('DOMContentLoaded', setupPage)
const quoteList = document.querySelector('#quote-list')
const quoteForm = document.querySelector('#new-quote-form')

function setupPage() {
    addFormHandler()
    renderAllQuotes()
} 

function renderAllQuotes() {
    quoteList.textContent = ""
    getQuotes().then(function(data) {
        data.forEach(renderQuote)
    })
}

function getQuotes() {
    return fetch('http://localhost:3000/quotes').then(res => res.json())
} 

function renderQuote(quote) {
    let quoteCard = document.createElement('li')
    quoteCard.dataset.id = quote.id
    quoteCard.className = 'quote-card'
        let quoteBlock = document.createElement('blockquote')
        quoteBlock.className = 'blockquote'
        quoteCard.appendChild(quoteBlock)

        let quoteContent = document.createElement('p')
        quoteContent.className = 'mb-0'
        quoteContent.textContent= quote.quote
        quoteCard.appendChild(quoteContent) 

        let quoteAuthor = document.createElement('footer')
        quoteAuthor.className = 'blockquote-footer'
        quoteAuthor.textContent = quote.author 
        quoteCard.appendChild(quoteAuthor)

        let likeBtn = document.createElement('button')
        likeBtn.className = 'btn-success'
        likeBtn.textContent = 'Likes: '
        likeBtn.addEventListener('click',() => addLike(quote))
        quoteCard.appendChild(likeBtn)

            let quoteLikes = document.createElement('span')
            quoteLikes.textContent = quote.likes 
            likeBtn.appendChild(quoteLikes)

        let deleteBtn = document.createElement('button')
        deleteBtn.className = 'btn-danger'
        deleteBtn.textContent = 'Delete'
        deleteBtn.addEventListener('click',removeQuote)
        quoteCard.appendChild(deleteBtn)

    quoteList.appendChild(quoteCard)    
}

function addFormHandler() {
    quoteForm.addEventListener('submit', newQuote)
} 

function newQuote() {
    event.preventDefault()
    let newQuote = document.getElementById('new-quote').value
    let newAuthor = document.getElementById('author').value
    
    createQuote(newQuote, newAuthor).then(renderQuote)
    event.target.reset()
} 

function createQuote(newQuote, newAuthor) {
    return fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            quote: newQuote,
            likes: 0,
            author: newAuthor
        })
    }).then(res => res.json())
}

function removeQuote() {
    let byeQuote = event.target.parentElement
    byeQuote.parentElement.removeChild(byeQuote) 

    let id = event.target.parentElement.dataset.id 
    deleteQuote(id)
} 

function deleteQuote(id) {
    return fetch(`http://localhost:3000/quotes/${id}`,{
        method: 'DELETE',
        headers: 
        {
          "Content-Type": "application/json",
          Accept: "application/json"
        }, 
    })  
} 

function addLike(quote) {
    let newLikes = quote.likes + 1
    event.target.children[0].textContent = newLikes
    let id = quote.id
    updateLikes(id, newLikes)
}

function updateLikes(id, newLikes) {
    return fetch(`http://localhost:3000/quotes/${id}`,{
        method: 'PATCH',
        headers: 
        {
          "Content-Type": "application/json",
          Accept: "application/json"
        }, 
        body: JSON.stringify({
          likes: newLikes
        })
      })    
}
