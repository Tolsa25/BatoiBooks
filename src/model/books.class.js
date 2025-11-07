import Book from './book.class';
import { getDBBooks, addDBBook, removeDBBook, changeDBBook } from '../services/books.api.js'; 

class Books {
    constructor() {
        this.data = [];
    }

    async populate() {
        const dataInicial = await getDBBooks(); 
        this.data = dataInicial.map(bookData => new Book(bookData));
    }

    async addBook(bookData) {
        const createdBook = await addDBBook(bookData); 
        
        const newBookInstance = new Book(createdBook);

        this.data.push(newBookInstance);
        return newBookInstance;
    }

    async removeBook(id) {
        await removeDBBook(id); 

        const index = this.data.findIndex(book => book.id === id);

        if (index === -1) {
            throw new Error(`Libro con id ${id} no encontrado localmente.`); 
        }

        this.data.splice(index, 1);
    }

    async changeBook(bookData) {
        const updatedBook = await changeDBBook(bookData);

        const id = bookData.id;
        const index = this.data.findIndex(book => book.id === id);

        if (index === -1) {
            throw new Error(`Libro con id ${id} no encontrado localmente.`);
        }

        this.data[index] = new Book(updatedBook);

        return this.data[index];
    }

    toString() {
        return this.data.map(book => book.toString()).join('\n');
    }

    getBookById(bookId) {
        let encontrarLibro = this.data.find(book => book.id === bookId);
        if (!encontrarLibro) {
            throw new Error(`El libro con id ${bookId} no existe`);
        }
        return encontrarLibro;
    }

    getBookIndexById(bookId) {
        let encontrarIndice = this.data.findIndex(book => book.id === bookId);
        if (encontrarIndice === -1) {
            throw new Error(`El libro con id ${bookId} no existe`);
        }
        return encontrarIndice;
    }

    bookExists(userId, moduleCode) {
        return this.data.some(book => book.userId === userId && book.moduleCode === moduleCode);
    }

    booksFromUser(userId) {
        return this.data.filter(book => book.userId === userId);
    }

    booksFromModule(moduleCode) {
        return this.data.filter(book => book.moduleCode === moduleCode);
    }

    booksCheeperThan(price) {
        return this.data.filter(book => book.price <= price);
    }

    booksWithStatus(status) {
        return this.data.filter(book => book.status === status);
    }

    averagePriceOfBooks() {
        if (this.data.length === 0) {
            return "0.00 €";
        }
        let precioMedio = this.data.reduce((SumaPrecios, book) => SumaPrecios + book.price, 0) / this.data.length;
        return precioMedio.toFixed(2) + " €";
    }

    booksOfTypeNotes() {
        return this.data.filter(book => book.publisher === "Apunts");
    }

    booksNotSold() {
        return this.data.filter(book => book.soldDate === "");
    }
}

export default Books;