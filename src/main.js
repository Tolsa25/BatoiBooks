import Modules from './model/modules.class';
import Users from './model/users.class'; 
import Books from './model/books.class'; 
import './style.css'; 

const modules = new Modules();
const users = new Users();
const books = new Books();

async function main() {
    await modules.populate();
    await users.populate();
    await books.populate();

    console.log("------------------------------------------");
    console.log("1. Libros del módulo 5021:");
    try {
        const booksInModule5021 = books.booksFromModule("5021");
        if (booksInModule5021.length > 0) {
            const output = booksInModule5021.map(book => book.toString()).join('\n');
            console.log(output);
        } else {
            console.log("No se encontraron libros para el módulo 5021.");
        }
    } catch (error) {
        console.error("Error al buscar libros por módulo:", error.message);
    }

    console.log("------------------------------------------");
    console.log("2. Libros con estado 'new':");
    try {
        const newBooks = books.booksWithStatus("new");
        if (newBooks.length > 0) {
            const output = newBooks.map(book => book.toString()).join('\n');
            console.log(output);
        } else {
            console.log("No se encontraron libros nuevos.");
        }
    } catch (error) {
        console.error("Error al buscar libros por estado:", error.message);
    }

    console.log("------------------------------------------");
    console.log("3. Precio medio de todos los libros:");
    try {
        const averagePrice = books.averagePriceOfBooks();
        console.log(`El precio medio de todos los libros es: ${averagePrice}`);
    } catch (error) {
        console.error("Error al calcular el precio medio:", error.message);
    }

    console.log("------------------------------------------");
    console.log("4. Libros que NO se han vendido (soldDate vacía):");
    try {
        const unsoldBooks = books.booksNotSold();
        if (unsoldBooks.length > 0) {
            const output = unsoldBooks.map(book => 
                `Book ID: ${book.id}, Module: ${book.moduleCode}, Status: ${book.status}, Price: ${book.price} €`
            ).join('\n');
            console.log(output);
        } else {
            console.log("¡Todos los libros se han vendido!");
        }
    } catch (error) {
        console.error("Error al buscar libros no vendidos:", error.message);
    }
    console.log("------------------------------------------");
}

document.querySelector('#app').innerHTML = `
  <div>
    <img src="/logoBatoi.png" class="logo" alt="Logo de BatoiBooks" />
    <h1>Hello BatoiBooks!</h1>
  </div>
`; 

main().catch(error => {
    console.error("ERROR CRÍTICO EN LA CARGA INICIAL:", error.message);
});