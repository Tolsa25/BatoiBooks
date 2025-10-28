import Book from './book.class';

class Books {
    constructor() {
        this.data = [];
    }

    populate(dataInicial) {
        this.data = dataInicial.map(bookData => new Book(bookData));
    }

    addBook(bookData) {
        const newId = this.data.length > 0 ? Math.max(...this.data.map(b => b.id)) + 1 : 1;
        
        const newBookInstance = new Book({
            id: newId,
            ...bookData
        });

        this.data.push(newBookInstance);
        return newBookInstance;
    }

    removeBook(id) {
        const index = this.data.findIndex(book => book.id === id);

        if (index === -1) {
            throw new Error(`Libro con id ${id} no encontrado.`);
        }

        this.data.splice(index, 1);
    }

    changeBook(bookData) {
        const id = bookData.id;
        const index = this.data.findIndex(book => book.id === id);

        if (index === -1) {
            throw new Error(`Libro con id ${id} no encontrado`);
        }

        this.data[index] = new Book(bookData);

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

    incrementPriceOfbooks(percentage) {
        return this.data.map(book => {
            let newPrice = book.price * (1 + percentage);
            return {
                ...book,
                price: parseFloat(newPrice.toFixed(2))
            };
        });
    }

}

export default Books;