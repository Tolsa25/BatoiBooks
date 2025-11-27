import Book from './book.class.js';

export default class Cart {
    constructor() {
        /** @type {Book[]} */
        this.data = [];
    }

    async populate() {
        if (!this.data) {
            this.data = [];
        }
    }

    /**
     * Obtiene un libro del carrito por su ID.
     * @param {string | number} id 
     * @returns {Book | undefined}
     */
    
    getBookById(id) {
        return this.data.find(book => String(book.id) === String(id));
    }

    /**
     * @param {Book} book 
     */

    addItem(book) {
        if (this.getBookById(book.id)) {
            throw new Error(`El libro con ID ${book.id} ya se encuentra en el carrito.`);
        }
        
        const bookCopy = new Book({ ...book }); 
        this.data.push(bookCopy);
    }

    /**
     * Lanza un error si el libro no está en el carrito.
     * @param {string | number} id
     */

    removeItem(id) {
        const index = this.data.findIndex(book => String(book.id) === String(id));

        if (index === -1) {
            throw new Error(`El libro con ID ${id} no está en el carrito.`);
        }

        this.data.splice(index, 1);
    }

    /**
     * Muestra información resumida de los libros en el carrito.
     * @returns {string} 
     */

    toString() {
        if (this.data.length === 0) {
            return "El carrito de la compra está vacío.";
        }
        const total = this.data.reduce((sum, book) => sum + book.price, 0).toFixed(2);
        const list = this.data.map(book => `- ${book.moduleCode} (${book.publisher}): ${book.price.toFixed(2)} €`).join('\n');
        
        return `Contenido del Carrito (${this.data.length} libros):\n${list}\nTotal: ${total} €`;
    }
}