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
interface StockedBook extends Book {
  stock: number;
  ratings: number[];
}

function getRandomInteger(min: number, max: number): number {
  if (min > max) {
    [min, max] = [max, min];
  }
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  return randomNumber;
}

async function fetchData(url: string): Promise<Book[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }
    const data: Book[] = await response.json();
    const stockedData: StockedBook[] = data.map((book) => ({
      ...book,
      stock: getRandomInteger(1, 10),
      ratings: [
        getRandomInteger(1, 5),
        getRandomInteger(1, 5),
        getRandomInteger(1, 5),
      ],
    }));
    return stockedData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
function avgRating(ratings: number[]): number {
  if (ratings.length === 0) {
    return 0;
  }

  const totalRating = ratings.reduce((sum, rating) => sum + rating, 0);
  const averageRating = totalRating / ratings.length;

  return Math.round(averageRating);
}

function calculateAverage(num: number): number {
  let sum = 0;

  for (let i = 0; i < num; i++) {
    sum += i + 1;
  }

  const average = sum / num;
  return Math.round(average);
}

function openBook(book: StockedBook): void {
  const overlayBookEl: HTMLDivElement | null = document.querySelector(
    "#overlay__book"
  ) as HTMLDivElement;
  const overlayBookContentEl: HTMLDivElement | null = document.querySelector(
    "#overlayBook__content"
  ) as HTMLDivElement;
  overlayBookEl.classList.remove("hidden");
  overlayBookContentEl.innerHTML = "";

  //leftCol => bookCover
  let leftCol = document.createElement("div");
  leftCol.style.background = book.color;
  leftCol.classList.add("overlay__leftCol");
  let leftTitle = document.createElement("h2");
  leftTitle.textContent = book.title;
  let leftAuthor = document.createElement("p");
  leftAuthor.textContent = book.author;
  let ratings = document.createElement("div");

  let ratingStars = document.createElement("div");
  for (let i = 0; i < avgRating(book.ratings); i++) {
    ratingStars.classList.add("img__star");
    const imgElement = document.createElement("img");
    imgElement.src = "./assets/star-filled.png";
    imgElement.alt = "Description of the image";
    imgElement.classList.add("star");
    ratingStars.appendChild(imgElement);
  }
  if (avgRating(book.ratings) < 5) {
    for (let i = avgRating(book.ratings); i < 5; i++) {
      ratingStars.classList.add("img__star");
      const imgElement = document.createElement("img");
      imgElement.src = "./assets/star-empty.png";
      imgElement.alt = "Description of the image";
      imgElement.classList.add("star");
      ratingStars.appendChild(imgElement);
    }
  }

  if (avgRating(book.ratings) > 0) {
    console.log("fill");
  }
  leftCol.appendChild(leftTitle);
  leftCol.appendChild(leftAuthor);
  leftCol.appendChild(ratings);
  leftCol.appendChild(ratingStars);
  overlayBookContentEl.appendChild(leftCol);

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
  if (book.stock === 0) {
    btnBuy.textContent = `Book sold out`;
    btnBuy.disabled = true;
    btnBuy.style.background = "darkgrey";
    btnBuy.style.color = "black";
  } else {
    btnBuy.textContent = `Buy book! (Stock: ${book.stock})`;
  }
  btnBuy.classList.add("btnBuy");
  btnBuy.addEventListener("click", function () {
    book.stock--;
    btnBuy.textContent = `Buy book! (Stock: ${book.stock})`;
    if (book.stock === 0) {
      btnBuy.textContent = `Book sold out`;
      btnBuy.disabled = true;
      btnBuy.style.background = "darkgrey";
      btnBuy.style.color = "black";
    }
  });
  rightCol.appendChild(rightHeader);
  rightCol.appendChild(rightAuthor);
  rightCol.appendChild(rightPlot);
  moreInfoEl.appendChild(rightAudience);
  moreInfoEl.appendChild(rightPublished);
  moreInfoEl.appendChild(rightPages);
  moreInfoEl.appendChild(rightPublisher);
  rightCol.appendChild(moreInfoEl);
  rightCol.appendChild(btnBuy);
  overlayBookContentEl.appendChild(rightCol);
}

function printApiData(books: StockedBook[]): void {
  const booksListElement: HTMLDivElement | null = document.querySelector(
    "#booksList"
  ) as HTMLDivElement;
  const numberOfBooksEl: HTMLDivElement | null = document.querySelector(
    "#numberOfBooks"
  ) as HTMLDivElement;
  booksListElement.innerHTML = "";
  //update number of books in the api
  numberOfBooksEl.innerHTML = books.length.toString();
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

const overlayBookEl: HTMLDivElement | null = document.querySelector(
  "#overlay__book"
) as HTMLDivElement;
const overlayCloseEl: HTMLDivElement | null = document.querySelector(
  "#overlay__close"
) as HTMLDivElement;
if (overlayBookEl) {
  overlayBookEl.classList.add("hidden");
}

overlayCloseEl.addEventListener("click", function () {
  overlayBookEl.classList.add("hidden");
});

fetchData(apiUrl)
  .then((data: StockedBook[]) => {
    printApiData(data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
