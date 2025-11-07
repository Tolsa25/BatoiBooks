//getDBBooks     devuelve todos los registros de esa tabla
export async function getDBBooks() {
    let response = await fetch ('http://localhost:3000/books');
    if(!response.ok){
        let errorText = await response.text();
        throw new Error(`Error al obtener los libros: ${response.status} ${response.statusText}. Detalle: ${errorText}`);
    }
    let tabla = await response.json();
    return tabla;
}

//getDBBook      devuelve el registro cuya id coincide con la pasada como parámetro
export async function getDBBook(id){
   let url = `http://localhost:3000/books/${id}`;
   let response = await fetch (url);

   if(!response.ok){
        let errorText = await response.text();
        throw new Error(`Error al obtener el libro: ${response.status} ${response.statusText}. Detalle: ${errorText}`);
    }
    let libro = await response.json();
    return libro;
}

//addDBBook      recibe un nuevo objeto que añadirá a la tabla
export async function addDBBook(newBook) {
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

//removeDBBook   recibe la id de un nuevo objeto y lo borrará de la tabla
export async function removeDBBook(idBook) {
    let url = `http://localhost:3000/books/${idBook}`;
    let options = {
        method: 'DELETE'
    };

        let response = await fetch(url, options);

        if (!response.ok) {
            let errorText = await response.text();
            throw new Error(`Error al eliminar el libro: ${response.status} ${response.statusText}. Detalle: ${errorText}`);
        }
        
        let delBook = await response.json();
        return delBook;
}

//changeDBBook   recibe un objeto que ya existe en la tabla y lo modifica, usando el método PUT
export async function changeDBBook(book) {
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