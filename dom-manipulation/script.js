// ---------- STORAGE KEYS ----------
container.append(quoteInput, categoryInput, button);
document.body.appendChild(container);
}


// ---------- ADD QUOTE ----------
function addQuote() {
const text = document.getElementById('newQuoteText').value.trim();
const category = document.getElementById('newQuoteCategory').value.trim();


if (!text || !category) {
alert('Please fill in all fields');
return;
}


quotes.push({ text, category });
saveQuotes();
updateCategories();
categorySelect.value = category;
showRandomQuote();
}


// ---------- EXPORT TO JSON ----------
function exportToJson() {
const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
const url = URL.createObjectURL(blob);


const link = document.createElement('a');
link.href = url;
link.download = 'quotes.json';
link.click();


URL.revokeObjectURL(url);
}


// ---------- IMPORT FROM JSON ----------
function importFromJsonFile(event) {
const fileReader = new FileReader();


fileReader.onload = function(e) {
try {
const importedQuotes = JSON.parse(e.target.result);
quotes.push(...importedQuotes);
saveQuotes();
updateCategories();
alert('Quotes imported successfully!');
} catch {
alert('Invalid JSON file');
}
};


fileReader.readAsText(event.target.files[0]);
}


// ---------- BUTTONS FOR IMPORT / EXPORT ----------
const exportBtn = document.createElement('button');
exportBtn.textContent = 'Export Quotes (JSON)';
exportBtn.onclick = exportToJson;


const importInput = document.createElement('input');
importInput.type = 'file';
importInput.accept = '.json';
importInput.onchange = importFromJsonFile;


// ---------- INITIALIZATION ----------
updateCategories();
createAddQuoteForm();
document.body.append(exportBtn, importInput);


newQuoteBtn.addEventListener('click', showRandomQuote);


// Restore last viewed quote (session storage)
const lastQuote = JSON.parse(sessionStorage.getItem(SESSION_KEY));
if (lastQuote) {
quoteDisplay.innerHTML = `"${lastQuote.text}" — ${lastQuote.category}`;
}
