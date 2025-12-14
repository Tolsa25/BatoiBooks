import Book from './book.class.js';

export default class Cart {
    constructor() {
        /** @type {Book[]} */
        this.data = [];
    }

    populate() {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            this.data = JSON.parse(storedCart);
        } else {
            this.data = [];
        }
    }

    save() {
        localStorage.setItem('cart', JSON.stringify(this.data));
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

        this.data.push(book);
        this.save();
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
        this.save();
    }

    empty() {
        this.data = [];
        this.save();
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