document.addEventListener("DOMContentLoaded", () => {
    const bookList = document.querySelector(".book-list");
    const favoriteList = document.querySelector(".favorite-list");
    const searchBar = document.querySelector("#search-bar");
    const genreFilter = document.querySelector("#genre-filter");
    const yearFilter = document.querySelector("#year-filter");

    let books = []; // Variable para almacenar los libros de la API

    // Verificar si estamos en la página del catálogo
    const isCatalogPage = window.location.pathname.includes("catalog.html");

    // Cargar libros favoritos desde el localStorage
    let favoriteBooks = JSON.parse(localStorage.getItem("favoriteBooks")) || [];

    // Llamada a la API de Open Library
    const url = 'https://openlibrary.org/subjects/science_fiction.json?limit=12';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            books = data.works;
            populateYearFilter(books); // Llenar el filtro de años
            displayBooks(books); // Mostrar todos los libros inicialmente
            displayFavorites(); // Mostrar los favoritos

            // Evento para búsqueda
            searchBar.addEventListener("input", filterBooks);
            genreFilter.addEventListener("change", filterBooks);
            yearFilter.addEventListener("change", filterBooks);
        })
        .catch(error => console.log("Error al cargar los libros:", error));

// Función para mostrar libros en la página
function displayBooks(booksToDisplay) {
    bookList.innerHTML = ""; // Limpiar la lista de libros
    booksToDisplay.forEach(book => {
        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");

        const bookCover = book.cover_id 
            ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
            : 'path/to/default-cover.jpg'; // Usar una imagen por defecto si no hay portada

        bookCard.innerHTML = `
            <img src="${bookCover}" alt="${book.title}" class="book-cover">
            <h3>${book.title}</h3>
            <p>Autor: ${book.authors[0]?.name || "Desconocido"}</p>
            <button class="details-btn" data-key="${book.key}">Leer más</button>
        `;
        bookList.appendChild(bookCard);
    });
}


    // Función para rellenar el filtro de años
    function populateYearFilter(books) {
        const years = books.map(book => book.first_publish_year).filter(year => year);
        const uniqueYears = [...new Set(years)]; // Años únicos

        uniqueYears.sort().forEach(year => {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            yearFilter.appendChild(option);
        });
    }

    // Función para filtrar los libros
    function filterBooks() {
        const searchTerm = searchBar.value.toLowerCase();
        const selectedGenre = genreFilter.value;
        const selectedYear = yearFilter.value;

        const filteredBooks = books.filter(book => {
            const title = book.title.toLowerCase();
            const author = book.authors[0]?.name.toLowerCase() || "";
            const genre = book.subjects?.includes(selectedGenre);
            const year = book.first_publish_year?.toString() === selectedYear || selectedYear === "";

            return (title.includes(searchTerm) || author.includes(searchTerm)) &&
                   (selectedGenre === "" || genre) &&
                   (selectedYear === "" || year);
        });

        displayBooks(filteredBooks); // Mostrar libros filtrados
    }
});
