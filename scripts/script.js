// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore/lite';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import '../styles/style.css';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMYxcl0NEID2ZfRyzJAJgWL0jtslzgM_o",
  authDomain: "toplibrary-1b962.firebaseapp.com",
  projectId: "toplibrary-1b962",
  storageBucket: "toplibrary-1b962.appspot.com",
  messagingSenderId: "221788127750",
  appId: "1:221788127750:web:2ee7f61efd6f1bc9a23987"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// sign in to firebase
async function signIn() {
  var provider = new GoogleAuthProvider();
  await signInWithPopup(getAuth(), provider);
  console.log(`signed in as ${getUserName}`);
}

function getUserName() {
  return getAuth().currentUser.displayName;
}

// Sign out of Firebase.
function signOutUser() {
  signOut(getAuth());
  console.log('signed out');
}

let myLibrary = [];
let currentBookView; // MUST be undefined to start for previous/next book buttons to start display at index 0
let allBooksView = false;

// class for array controls
class Book {
    // book constructor function
    constructor(title, author, genre, isRead) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.isRead = isRead;
    }
}

// add an object book to the library
function addBookToLibrary(book) {
    myLibrary.push(book);
}

function userAddNewBook() {
    let title = document.getElementById('bookTitle').value;
    let author = document.getElementById('bookAuthor').value;
    let genre = document.getElementById('bookGenre').value;
    let isRead;

    if (document.getElementById('haveRead').checked) {
        isRead = 'true';
    } else {
        isRead = 'false';
    }
    // don't allow user to enter blank information
    if (title == "" || author == "" || genre == "") {
        alert("Invalid input. Please fill out all fields.")
    } else {
        let bookToAdd = new Book(title, author, genre, isRead);
        addBookToLibrary(bookToAdd);
        clearForm();
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

async function saveBooksArray() {
  try {
    await setDoc(doc(db, getUserName(), 'library'), {
      name: getUserName(),
      data: JSON.stringify(myLibrary)
    });
    console.log('file written')
  }
  catch(error) {
    console.error('error saving to Firebase', error);
  }
}

async function loadBooksArray() {
  const docRef = doc(db, getUserName(), 'library');
  const docSnap = await getDoc(docRef);
  const libObj = await docSnap.data();

  if (docSnap.exists()) {
    myLibrary = JSON.parse(libObj.data);
  } else {
    console.log('failed to load or library does not exist');
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
    if (myLibrary[currentBookView].isRead == 'true') {
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
            allCardTitle.textContent = "Title: " + myLibrary[i].title;
            const allCardAuthor = document.createElement('div');
            allCardNumber.appendChild(allCardAuthor);
            allCardAuthor.textContent = "Author: " + myLibrary[i].author;
            const allCardGenre = document.createElement('div');
            allCardNumber.appendChild(allCardGenre);
            allCardGenre.textContent = "Genre: " + myLibrary[i].genre;
            const allCardIsRead = document.createElement('div');
            allCardNumber.appendChild(allCardIsRead);
            if (myLibrary[i].isRead == 'true') {
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

function cardToggleRead() {
    myLibrary[currentBookView].isRead = !myLibrary[currentBookView].isRead;
    if (myLibrary[currentBookView].isRead) {
        cardIsReadText.textContent = "Yes";
    } else {
        cardIsReadText.textContent = "No";
    }
}

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
const signInButton = document.getElementById('signIn');
signInButton.addEventListener('click', signIn);
const signOutButton = document.getElementById('signOut');
signOutButton.addEventListener('click', signOutUser);

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