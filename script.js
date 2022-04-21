const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

// show modal, focus on input
function showModal() {
  modal.classList.add('show-modal');
  websiteUrlEl.focus();
}

// modal event listners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));

// validate form 
function validate(nameValue, urlValue) {
  const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert('please submit values for both fields');
    return false;
  }
  if (!urlValue.match(regex)) {
    alert('Please provide valid web address');
    return false;
  }
  // valid info
  return true;
}

// build bookmarks DOM
function buildBookmarks() {
  // remove bookmarks DOM
  bookmarksContainer.textContent = '';
  
  // build items
  bookmarks.forEach((bookmark) => {
    // method below is called destructuring
    const { name, url } = bookmark;
    // console.log(name, url);

    // item
    const item = document.createElement('div');
    item.classList.add('item');
    // close icon
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('fas', 'fa-times');
    closeIcon.setAttribute('title', 'Delete Bookmark');
    closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
    // favicon / link container
    const linkInfo = document.createElement('div');
    linkInfo.classList.add('name');
    // favicon
    const favicon = document.createElement('img');
    favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
    favicon.setAttribute('alt', 'Favicon');
    // link
    const link =  document.createElement('a');
    link.setAttribute('href', `${url}`);
    link.setAttribute('target', '_blank');
    link.textContent = name;
    // append to bookmarks container
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
}

// fetch bookmarks
function fetchBookmarks() {
  // get bookmarks if available
  if (localStorage.getItem('bookmarks')){
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  } else {
    // create bookmarks array in localstorage
    bookmarks = [
      {
        name: 'Dwight Mckenzie',
        url: 'https://dwightmckenzie.com' 
      }
    ];
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }
  // console.log(bookmarks);
  buildBookmarks();
}

// delete a bookmark
function deleteBookmark(url) {
  console.log('delete url', url);
  
  bookmarks.forEach((bookmark, i) => {
    if (bookmark.url === url) {
      bookmarks.splice(i, 1);
    }

  });  
  // update bookmarks array in local storage, re-populate DOM
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmarks();
}

// handle data from form
function  storeBookmark(e) {
  e.preventDefault(); // to prevent form from sending form or calling request
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;

  if (!urlValue.includes('http://') && !urlValue.includes('https://')) { 
    urlValue = `https://${urlValue}`;
    console.log(nameValue, urlValue);
  }
  // console.log(nameValue, urlValue);
  if (!validate(nameValue, urlValue)) {
    // alert('please submit values for both fields');
    return false;
  }
  const bookmark = {
    name: nameValue,
    url: urlValue
  };
  bookmarks.push(bookmark);
  // console.log(JSON.stringify(bookmarks));
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();

}

// event listenrs
bookmarkForm.addEventListener('submit', storeBookmark);

// on load
fetchBookmarks();
