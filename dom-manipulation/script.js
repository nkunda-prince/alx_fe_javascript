// Quote data structure
});
}


// Display a random quote based on selected category
function showRandomQuote() {
const selectedCategory = categorySelect.value;
const filteredQuotes = quotes.filter(q => q.category === selectedCategory);


if (filteredQuotes.length === 0) {
quoteDisplay.textContent = 'No quotes available for this category.';
return;
}


const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
const quote = filteredQuotes[randomIndex];


quoteDisplay.innerHTML = `
<div>"${quote.text}"</div>
<div class="category">— ${quote.category}</div>
`;
}


// Create and insert Add Quote form dynamically
function createAddQuoteForm() {
const formContainer = document.createElement('div');


const quoteInput = document.createElement('input');
quoteInput.id = 'newQuoteText';
quoteInput.type = 'text';
quoteInput.placeholder = 'Enter a new quote';


const categoryInput = document.createElement('input');
categoryInput.id = 'newQuoteCategory';
categoryInput.type = 'text';
categoryInput.placeholder = 'Enter quote category';


const addButton = document.createElement('button');
addButton.textContent = 'Add Quote';
addButton.onclick = addQuote;


formContainer.appendChild(quoteInput);
formContainer.appendChild(categoryInput);
formContainer.appendChild(addButton);


document.body.appendChild(formContainer);
}


// Add a new quote dynamically
function addQuote() {
const textInput = document.getElementById('newQuoteText');
const categoryInput = document.getElementById('newQuoteCategory');


const text = textInput.value.trim();
const category = categoryInput.value.trim();


if (!text || !category) {
alert('Please enter both quote text and category');
return;
}


quotes.push({ text, category });


textInput.value = '';
categoryInput.value = '';


updateCategories();
categorySelect.value = category;
showRandomQuote();
}


// Event listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);


// Initial setup
updateCategories();
showRandomQuote();
