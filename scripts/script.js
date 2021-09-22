let myLibrary = [];
let currentBookView; // MUST be undefined to start for previous/next book buttons to start display at index 0
let allBooksView = false;

// book constructor function
function Book(title, author, genre, isRead) {
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.isRead = isRead;
};

// add an object book to the library
function addBookToLibrary(book) {
    myLibrary.push(book);
}

function userAddNewBook() {
    let title = document.getElementById('bookTitle').value;
    let author = document.getElementById('bookAuthor').value;
    let genre = document.getElementById('bookGenre').value;
    let isRead = document.getElementById('haveRead').value;

    // don't allow user to enter blank information
    if (title == "" || author == "" || genre == "") {
        alert("Invalid input. Please fill out all fields.")
    } else {
        let bookToAdd = new Book(title, author, genre, isRead);
        addBookToLibrary(bookToAdd);
        clearForm();
    }
}

function openForm() {
    document.getElementById('newBookForm').style.display = "flex";
}

function clearForm() {
    document.getElementById('bookTitle').value = "";
    document.getElementById('bookAuthor').value = "";
    document.getElementById('bookGenre').value = "";
    document.getElementById('haveRead').checked = false;
}

function closeForm() {
    document.getElementById('newBookForm').style.display = "none";
}

function viewBookCardNormal() {
    cardTitleText.textContent = myLibrary[currentBookView].title;
    cardAuthorText.textContent = myLibrary[currentBookView].author;
    cardGenreText.textContent = myLibrary[currentBookView].genre;
    if (myLibrary[currentBookView].isRead) {
        cardIsReadText.textContent = "Yes";
    } else {
        cardIsReadText.textContent = "No";
    }
}

function viewNextBook() {
    if (currentBookView == undefined || currentBookView == myLibrary.length - 1) {
        currentBookView = 0;
    } else {
        currentBookView++;
    }

    viewBookCardNormal();
}

function viewPrevBook() {
    if (currentBookView == undefined || currentBookView == 0)  {
        currentBookView = myLibrary.length - 1;
    } else {
        currentBookView--;
    }

    viewBookCardNormal();
}

function viewAllBooks() {
    const allBooksPopup = document.querySelector('.allBooksPopup');

    if (allBooksView == false) {
        for (let i = 0; i < myLibrary.length; i++) { // creates a new book card for each element in array
            const allCardNumber = document.createElement('div');
            allBooksPopup.appendChild(allCardNumber);
            allCardNumber.className = 'bookCard';

            const allCardTitle = document.createElement('div');
            allCardNumber.appendChild(allCardTitle);
            allCardTitle.textContent = myLibrary[i].title;
            const allCardAuthor = document.createElement('div');
            allCardNumber.appendChild(allCardAuthor);
            allCardAuthor.textContent = myLibrary[i].author;
            const allCardGenre = document.createElement('div');
            allCardNumber.appendChild(allCardGenre);
            allCardGenre.textContent = myLibrary[i].genre;
            const allCardIsRead = document.createElement('div');
            allCardNumber.appendChild(allCardIsRead);
            if (myLibrary[i].isRead) {
                allCardIsRead.textContent = "Read";
            } else {
                allCardIsRead.textContent = "Not Read";
            }
        }
        allBooksView = true;
    } else {
        while (allBooksPopup.lastElementChild) { // deletes all children of the allBooksPopup div to hide display
            allBooksPopup.removeChild(allBooksPopup.lastElementChild);
        }
        allBooksView = false;
    }
}

function cardDeleteBook () {
    myLibrary.splice(currentBookView, 1);
    
    if (currentBookView = myLibrary.length) { // if deleting last entry, decrement currentBookView prevent it from
        currentBookView--;                    // being larger than the length of the array
    }
    if (myLibrary.length != 0){
        viewBookCardNormal();
    } else {
        cardTitleText.textContent = "";
        cardAuthorText.textContent = "";
        cardGenreText.textContent = "";
        cardIsReadText.textContent = "";
    }

}

function cardToggleRead() {
    myLibrary[currentBookView].isRead = !myLibrary[currentBookView].isRead;
    if (myLibrary[currentBookView].isRead) {
        cardIsReadText.textContent = "Yes";
    } else {
        cardIsReadText.textContent = "No";
    }
}

function saveBooksArray() {
    for (let i = 0; i < myLibrary.length; i++) { // iterate for each element in array
        let title = myLibrary[i].title; // get each property from each element
        let author = myLibrary[i].author;
        let genre = myLibrary[i].genre;
        let isRead = myLibrary[i].isRead;

        let storedString = title + ',' + author + ',' + genre + ',' + isRead; // create a string with each property separated by a comma
        localStorage.setItem(i, storedString); // send string of data at index i to localstorage
    }
}

function loadBooksArray() {
    let control = 0; // control variable for while loop
    while (localStorage.getItem(control) != null) { // loop until control runs out of data in localstorage
        let storedString = localStorage.getItem(control); // get string from storage
        let arrString = storedString.split(','); // split string at commas
        let bookVar = new Book(arrString[0], arrString[1], arrString[2], arrString[3]); // use array from .split() to populate book constructor
        myLibrary[control] = bookVar; // set book object to its index position using control variable
        control++;
    }
}
/* 
// manually create and add books to library for testing
addBookToLibrary(new Book("Title1" , "Author1", "Genre1", false));
addBookToLibrary(new Book("Title2" , "Author2", "Genre2", false));
addBookToLibrary(new Book("Title3" , "Author3", "Genre3", false));
addBookToLibrary(new Book("Title4" , "Author4", "Genre4", false)); */

// add event listener to control buttons
const newBook = document.querySelector('#newBook');
newBook.addEventListener('click', openForm);
const nextBook = document.querySelector('#nextBook');
nextBook.addEventListener('click', viewNextBook);
const prevBook = document.querySelector('#prevBook');
prevBook.addEventListener('click', viewPrevBook);
const viewAll = document.querySelector('#displayAll');
viewAll.addEventListener('click', viewAllBooks);
const loadData = document.getElementById('loadData');
loadData.addEventListener('click', loadBooksArray);
const saveData = document.getElementById('saveData');
saveData.addEventListener('click', saveBooksArray);

// listeners on book cards
const deleteBook = document.getElementById('deleteBook');
deleteBook.addEventListener('click', cardDeleteBook);
const toggleRead = document.getElementById('toggleRead');
toggleRead.addEventListener('click', cardToggleRead);

// listeners on new book form
const submitAdd = document.getElementById('submitAdd');
submitAdd.addEventListener('click', userAddNewBook);
const cancelAdd = document.getElementById('cancelAdd');
cancelAdd.addEventListener('click', closeForm);

// add DOM nodes to book card tags
const cardTitleText = document.getElementById('cardTitleText');
const cardAuthorText = document.getElementById('cardAuthorText');
const cardGenreText = document.getElementById('cardGenreText');
const cardIsReadText = document.getElementById('cardIsReadText');