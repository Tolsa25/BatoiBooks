export async function getDBBooks() {
    let response = await fetch('http://localhost:3000/books', {
        cache: 'no-store'
    });

    if (!response.ok) {
        let errorText = await response.text();
        throw new Error(`Error al obtener los libros: ${response.status} ${response.statusText}. Detalle: ${errorText}`);
    }
    let tabla = await response.json();
    return tabla;
}

export async function getDBBook(id) {
    let url = `http://localhost:3000/books/${id}`;
    let response = await fetch(url, {
        cache: 'no-store'
    });

    if (!response.ok) {
        let errorText = await response.text();
        throw new Error(`Error al obtener el libro: ${response.status} ${response.statusText}. Detalle: ${errorText}`);
    }
    let libro = await response.json();
    return libro;
}

function validateBook(book) {
    if (!book.moduleCode) {
        throw new Error("El módulo es obligatorio");
    }
    if (!book.publisher || book.publisher.trim() === "") {
        throw new Error("La editorial es obligatoria");
    }
    if (book.publisher.length > 50) {
        throw new Error("La editorial no puede tener más de 50 caracteres");
    }
    if (!book.price || isNaN(book.price) || Number(book.price) < 0.01) {
        throw new Error("El precio debe ser un número mayor o igual a 0.01");
    }
    if (!book.pages || isNaN(book.pages) || Number(book.pages) < 1) {
        throw new Error("El número de páginas debe ser mayor o igual a 1");
    }
    if (!book.status) {
        throw new Error("El estado es obligatorio");
    }
    if (book.comments && book.comments.length > 500) {
        throw new Error("Los comentarios no pueden exceder los 500 caracteres");
    }
}

export async function addDBBook(newBook) {

    validateBook(newBook);

    let url = 'http://localhost:3000/books';
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBook)
    };

    let response = await fetch(url, options);

    if (!response.ok) {
        let errorText = await response.text();
        throw new Error(`Error al crear el libro: ${response.status} ${response.statusText}. Detalle: ${errorText}`);
    }

    let createdBook = await response.json();
    return createdBook;
}

export async function removeDBBook(idBook) {
    let url = `http://localhost:3000/books/${idBook}`;
    let options = {
        method: 'DELETE'
    };

    let response = await fetch(url, options);

    if (response.ok || response.status === 204 || response.status === 404) {
        return null;
    }

    let errorText = await response.text();
    throw new Error(`Error al eliminar el libro: ${response.status} ${response.statusText}. Detalle: ${errorText}`);
}

export async function changeDBBook(book) {

    validateBook(book);

    let url = `http://localhost:3000/books/${book.id}`;
    let options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(book)
    };

    let response = await fetch(url, options);

    if (!response.ok) {
        let errorText = await response.text();
        throw new Error(`Error al actualizar el libro (ID: ${book.id}): ${response.status} ${response.statusText}. Detalle: ${errorText}`);
    }

    let updatedBook = await response.json();
    return updatedBook;
}

export async function checkBookExists(userId, moduleCode) {
    let url = `http://localhost:3000/books?userId=${userId}&moduleCode=${moduleCode}`;
    let response = await fetch(url, {
        cache: 'no-store'
    });

    if (!response.ok) {
        let errorText = await response.text();
        throw new Error(`Error al comprobar si existe el libro: ${response.status} ${response.statusText}. Detalle: ${errorText}`);
    }

    let searchResults = await response.json();
    return searchResults.length > 0;
}