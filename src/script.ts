interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  year: number;
  pages: number | null;
  plot: string;
  audience: string;
  color: string;
}

async function fetchData(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }
    const data: Book[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

function openBook(book: Book) {
  overlayBook.style.display = "flex";
  overlayBookContent.innerHTML = "";

  //leftCol => bookCover
  let leftCol = document.createElement("div");
  leftCol.style.background = book.color;
  leftCol.classList.add("overlay__leftCol");
  let leftTitle = document.createElement("h2");
  leftTitle.textContent = book.title;
  let leftAuthor = document.createElement("p");
  leftAuthor.textContent = book.author;
  leftCol.appendChild(leftTitle);
  leftCol.appendChild(leftAuthor);
  overlayBookContent.appendChild(leftCol);

  //rightCol => moreInfo about book
  let rightCol = document.createElement("div");
  rightCol.classList.add("overlay__rightCol");
  let rightHeader = document.createElement("h2");
  rightHeader.textContent = book.title;
  let rightAuthor = document.createElement("p");
  rightAuthor.textContent = "By " + book.author;
  rightAuthor.classList.add("paddBtm");
  let rightPlot = document.createElement("p");
  rightPlot.textContent = book.plot;

  let moreInfoEl = document.createElement("div");
  moreInfoEl.classList.add("flex50");

  let rightAudience = document.createElement("p");
  let audienceTitle = document.createElement("span");
  audienceTitle.textContent = "Audience: ";
  audienceTitle.classList.add("bold");
  let aduienceValue = document.createElement("span");
  aduienceValue.textContent = book.audience;
  rightAudience.appendChild(audienceTitle);
  rightAudience.appendChild(aduienceValue);

  let rightPublished = document.createElement("p");
  let publishedTitle = document.createElement("span");
  publishedTitle.textContent = "First Published: ";
  publishedTitle.classList.add("bold");
  let publishedValue = document.createElement("span");
  publishedValue.innerHTML = book.year.toString();
  rightPublished.appendChild(publishedTitle);
  rightPublished.appendChild(publishedValue);

  let rightPages = document.createElement("p");
  let pagesTitle = document.createElement("span");
  pagesTitle.classList.add("bold");
  pagesTitle.textContent = "Pages: ";
  let pagesValue = document.createElement("span");
  if (book.pages) {
    pagesValue.textContent = book.pages.toString();
  } else {
    pagesValue.textContent = "N/A";
  }
  rightPages.appendChild(pagesTitle);
  rightPages.appendChild(pagesValue);

  let rightPublisher = document.createElement("p");
  let publisherTitle = document.createElement("span");
  publisherTitle.classList.add("bold");
  publisherTitle.textContent = "Publisher: ";
  let publisherValue = document.createElement("span");
  publisherValue.textContent = book.publisher;
  rightPublisher.appendChild(publisherTitle);
  rightPublisher.appendChild(publisherValue);

  let btnBuy = document.createElement("button");
  btnBuy.textContent = "Buy book!";
  btnBuy.classList.add("btnBuy");
  rightCol.appendChild(rightHeader);
  rightCol.appendChild(rightAuthor);
  rightCol.appendChild(rightPlot);
  moreInfoEl.appendChild(rightAudience);
  moreInfoEl.appendChild(rightPublished);
  moreInfoEl.appendChild(rightPages);
  moreInfoEl.appendChild(rightPublisher);
  rightCol.appendChild(moreInfoEl);
  rightCol.appendChild(btnBuy);
  overlayBookContent.appendChild(rightCol);
}

function printApiData(books: Book[]) {
  const booksListElement: HTMLDivElement = document.getElementById(
    "booksList"
  ) as HTMLDivElement;
  booksListElement.innerHTML = "";
  //update number of books in the api
  numberOfBooks.innerHTML = books.length.toString();
  books.forEach((book) => {
    let bookContainer = document.createElement("article");
    bookContainer.style.background = book.color;
    bookContainer.classList.add("book__container");
    bookContainer.addEventListener("click", () => openBook(book));
    let bookTitle = document.createElement("h3");
    let bookAuthor = document.createElement("p");
    bookAuthor.textContent = book.author;
    bookTitle.textContent = book.title;
    bookContainer.appendChild(bookTitle);
    bookContainer.appendChild(bookAuthor);
    booksListElement.appendChild(bookContainer);
  });
}

const apiUrl: string =
  "https://my-json-server.typicode.com/zocom-christoffer-wallenberg/books-api/books";

const overlayBook: HTMLDivElement = document.getElementById(
  "overlay__book"
) as HTMLDivElement;

const overlayBookContent: HTMLDivElement = document.getElementById(
  "overlayBook__content"
) as HTMLDivElement;

const overlayClose: HTMLDivElement = document.getElementById(
  "overlay__close"
) as HTMLDivElement;

const numberOfBooks: HTMLDivElement = document.getElementById(
  "numberOfBooks"
) as HTMLDivElement;

overlayBook.style.display = "none";

overlayClose.addEventListener("click", function () {
  overlayBook.style.display = "none";
});

fetchData(apiUrl)
  .then((data: Book[]) => {
    printApiData(data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
