//dom elements

//sitename Element
const siteNameEl = document.getElementById("site-name-input");
//form element
const formEl = document.getElementById("bookmark-form");
//site URL element
const siteURLEl = document.getElementById("site-url-input");
const submitBtn = document.getElementById("submit-btn");
//list container
const listContainer = document.getElementById("bookmarks-list");

//clear the UI
listContainer.innerHTML = "";
//if theres something in the localStorage pull it up OR empty array init
let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

submitBtn.addEventListener("click", addBookmarks);

// URL validation 
function isValidURL(string) {
  return string.includes('.') && !string.includes(' ');
}

function addBookmarks(event) {
  event.preventDefault();
  //get form values and clean the input
  const siteName = siteNameEl.value.trim();
  let siteURL = siteURLEl.value.trim();
  // console.log(siteName);
  // console.log(siteURL);

  //pushing values to the bookmarks array
  if (!siteName || !siteURL) {
    alert("Input fields cannot be empty");
    return;
  } 
  
  // Basic URL validation
  if (!isValidURL(siteURL)) {
    alert("Please enter a valid URL (must contain a dot and no spaces)");
    return;
  }
  
  // Add https:// if missing
  if (!siteURL.startsWith('http://') && !siteURL.startsWith('https://')) {
    siteURL = 'https://' + siteURL;
  }
  
  {
    bookmarks.push({
      id: Date.now(),
      siteName,
      siteURL,
    });
    //also updating the localStorage as well
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    //console.log("About to execute update UI");
    updateUI();
    //clear the values after function call
    formEl.reset();
  } 
}
function updateUI() {
  // Clear the list first to prevent duplicates
  listContainer.innerHTML = "";
  
  const sortedBookmarks = [...bookmarks].reverse();
  // console.log(sortedBookmarks);
  sortedBookmarks.forEach((bookmark, index) => {
    console.log(`${bookmark.siteName}: ${index}`);
    const bookmarkLI = createBookmarkLI(bookmark);
    listContainer.append(bookmarkLI);
  });
}

function createBookmarkLI(bookmark) {
  console.log(`BookMark Recieved : ${bookmark}`);
  const li = document.createElement('li');
  li.innerHTML = `
    <a href = ${bookmark.siteURL} target = _blank>${bookmark.siteName}</a>
    <button onClick = "removeBookmark(${bookmark.id})">Remove</button>
  `
  return li;
}

function removeBookmark(id){
  console.log(id);
      bookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      updateUI();
}
document.addEventListener('DOMContentLoaded', updateUI);
// localStorage.clear();