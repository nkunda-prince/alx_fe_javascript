/*************************************************
 * STORAGE KEYS
 *************************************************/
const LOCAL_STORAGE_KEY = "dynamicQuotes";
const SESSION_STORAGE_KEY = "lastViewedQuote";

/*************************************************
 * LOAD QUOTES FROM LOCAL STORAGE (OR DEFAULT)
 *************************************************/
let quotes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [
  { text: "Faith is taking the first step even when you don't see the whole staircase.", category: "Faith" },
  { text: "Success is not final, failure is not fatal.", category: "Motivation" },
  { text: "Simplicity is the ultimate sophistication.", category: "Wisdom" }
];

/*************************************************
 * DOM REFERENCES
 *************************************************/
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categorySelect = document.getElementById("categorySelect");

/*************************************************
 * SAVE QUOTES TO LOCAL STORAGE
 *************************************************/
function saveQuotes() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));
}

/*************************************************
 * UPDATE CATEGORY DROPDOWN
 *************************************************/
function updateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categorySelect.innerHTML = "";

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

/*************************************************
 * SHOW RANDOM QUOTE
 *************************************************/
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filteredQuotes = quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const quote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];

  quoteDisplay.innerHTML = `
    <div>"${quote.text}"</div>
    <div><strong>— ${quote.category}</strong></div>
  `;

  // Save last viewed quote in session storage
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(quote));
}

/*************************************************
 * CREATE ADD-QUOTE FORM (ADVANCED DOM)
 *************************************************/
function createAddQuoteForm() {
  const container = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;

  container.append(quoteInput, categoryInput, addButton);
  document.body.appendChild(container);
}

/*************************************************
 * ADD NEW QUOTE
 *************************************************/
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  updateCategories();
  categorySelect.value = category;
  showRandomQuote();
}

/*************************************************
 * EXPORT QUOTES TO JSON
 *************************************************/
function exportToJson() {
  const blob = new Blob(
    [JSON.stringify(quotes, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();

  URL.revokeObjectURL(url);
}

/*************************************************
 * IMPORT QUOTES FROM JSON
 *************************************************/
function importFromJsonFile(event) {
  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      updateCategories();
      alert("Quotes imported successfully!");
    } catch (error) {
      alert("Invalid JSON file.");
    }
  };

  reader.readAsText(event.target.files[0]);
}

/*************************************************
 * INITIALIZATION
 *************************************************/
updateCategories();
createAddQuoteForm();
newQuoteBtn.addEventListener("click", showRandomQuote);

// Restore last viewed quote (session storage)
const lastQuote = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY));
if (lastQuote) {
  quoteDisplay.innerHTML = `"${lastQuote.text}" — ${lastQuote.category}`;
}

// Create Import / Export controls
const exportBtn = document.createElement("button");
exportBtn.textContent = "Export Quotes (JSON)";
exportBtn.onclick = exportToJson;

const importInput = document.createElement("input");
importInput.type = "file";
importInput.accept = ".json";
importInput.onchange = importFromJsonFile;

document.body.append(exportBtn, importInput);
