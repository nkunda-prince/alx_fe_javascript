/*************************************************
 * STORAGE KEYS
 *************************************************/
const QUOTES_KEY = "dynamicQuotes";
const FILTER_KEY = "selectedCategory";

/*************************************************
 * LOAD QUOTES FROM LOCAL STORAGE
 *************************************************/
let quotes = JSON.parse(localStorage.getItem(QUOTES_KEY)) || [
  { text: "Faith is taking the first step even when you don't see the whole staircase.", category: "Faith" },
  { text: "Success is not final, failure is not fatal.", category: "Motivation" },
  { text: "Simplicity is the ultimate sophistication.", category: "Wisdom" }
];

/*************************************************
 * DOM REFERENCES
 *************************************************/
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

/*************************************************
 * SAVE QUOTES TO LOCAL STORAGE
 *************************************************/
function saveQuotes() {
  localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));
}

/*************************************************
 * POPULATE CATEGORIES (MANDATORY)
 *************************************************/
function populateCategories() {
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = "";

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent =
      category === "all" ? "All Categories" : category;
    categoryFilter.appendChild(option);
  });

  // Restore last selected filter
  const savedFilter = localStorage.getItem(FILTER_KEY);
  if (savedFilter) {
    categoryFilter.value = savedFilter;
  }
}

/*************************************************
 * FILTER QUOTES BY CATEGORY (MANDATORY)
 *************************************************/
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem(FILTER_KEY, selectedCategory);

  let filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found for this category.";
    return;
  }

  const quote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  quoteDisplay.innerHTML = `"${quote.text}" — <strong>${quote.category}</strong>`;
}

/*************************************************
 * CREATE ADD QUOTE FORM (DOM)
 *************************************************/
function createAddQuoteForm() {
  const container = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const button = document.createElement("button");
  button.textContent = "Add Quote";
  button.onclick = addQuote;

  container.append(quoteInput, categoryInput, button);
  document.body.appendChild(container);
}

/*************************************************
 * ADD NEW QUOTE (UPDATES STORAGE + CATEGORIES)
 *************************************************/
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please fill in all fields");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  categoryFilter.value = category;
  filterQuotes();
}

/*************************************************
 * INITIALIZATION
 *************************************************/
populateCategories();
createAddQuoteForm();
newQuoteBtn.addEventListener("click", filterQuotes);
filterQuotes();
