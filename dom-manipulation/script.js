/*************************************************
 * STORAGE KEYS
 *************************************************/
const QUOTES_KEY = "dynamicQuotes";
const FILTER_KEY = "selectedCategory";

/*************************************************
 * SERVER CONFIG (SIMULATION)
 *************************************************/
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";
const SYNC_INTERVAL = 15000; // 15 seconds

/*************************************************
 * LOAD LOCAL DATA
 *************************************************/
let quotes = JSON.parse(localStorage.getItem(QUOTES_KEY)) || [
  { text: "Faith is taking the first step even when you don't see the whole staircase.", category: "Faith" },
  { text: "Success is not final, failure is not fatal.", category: "Motivation" }
];

/*************************************************
 * DOM REFERENCES
 *************************************************/
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

/*************************************************
 * SAVE TO LOCAL STORAGE
 *************************************************/
function saveQuotes() {
  localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));
}

/*************************************************
 * POPULATE CATEGORIES
 *************************************************/
function populateCategories() {
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = "";

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat === "all" ? "All Categories" : cat;
    categoryFilter.appendChild(option);
  });

  const savedFilter = localStorage.getItem(FILTER_KEY);
  if (savedFilter) categoryFilter.value = savedFilter;
}

/*************************************************
 * FILTER QUOTES
 *************************************************/
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem(FILTER_KEY, selected);

  const filtered =
    selected === "all"
      ? quotes
      : quotes.filter(q => q.category === selected);

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes found.";
    return;
  }

  const quote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerHTML = `"${quote.text}" — <strong>${quote.category}</strong>`;
}

/*************************************************
 * POST QUOTE TO SERVER (MOCK)
 *************************************************/
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });

    const result = await response.json();
    console.log("Quote posted to server (mock):", result);
  } catch (error) {
    console.error("Failed to post quote:", error);
  }
}

/*************************************************
 * ADD QUOTE
 *************************************************/
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please fill in all fields");
    return;
  }

  const newQuote = { text, category };

  // Save locally
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  categoryFilter.value = category;
  filterQuotes();

  // Send to server (mock POST)
  postQuoteToServer(newQuote);
}

/*************************************************
 * SERVER SYNC (FETCH)
 *************************************************/
async function syncQuotes() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();

    // Convert server data to quote format
    const serverQuotes = data.slice(0, 5).map(post => ({
      text: post.title,
      category: `User-${post.userId}`
    }));

    resolveConflicts(serverQuotes);

    // Notification for automated check
    showNotification("Quotes synced with server!");

  } catch (error) {
    console.error("Server sync failed:", error);
  }
}

/*************************************************
 * INITIALIZATION
 *************************************************/
populateCategories();
createAddQuoteForm();
filterQuotes();
newQuoteBtn.addEventListener("click", filterQuotes);

// Periodic server sync
setInterval(syncQuotes, 15000);   // updated to call syncQuotes


/*************************************************
 * USER NOTIFICATION UI
 *************************************************/
function showNotification(message) {
  const note = document.createElement("div");
  note.textContent = message;
  note.style.background = "#ffeb3b";
  note.style.padding = "10px";
  note.style.margin = "10px 0";

  document.body.prepend(note);

  setTimeout(() => note.remove(), 5000);
}

/*************************************************
 * ADD QUOTE FORM (DOM)
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
 * INITIALIZATION
 *************************************************/
populateCategories();
createAddQuoteForm();
filterQuotes();
newQuoteBtn.addEventListener("click", filterQuotes);

// Periodic server sync
setInterval(fetchQuotesFromServer, 15000);
